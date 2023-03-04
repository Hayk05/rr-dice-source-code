import transactionsHelpaer from '../helpers/transactionsHelpaer';
import playerPostgreModule from '../models/postgre/playerPostgreModule';
import roomPostgreModule from '../models/postgre/roomPostgreModule';
import transactionsPostgreModule from '../models/postgre/transactionsPostgreModule';
import playerRedisModule from '../models/redis/playerRedisModule';
import playerService from '../services/playerService';
import pmService from '../services/pmService';

export default {
    async getStartInstruction({ rrId }) {
        try {
            if (!rrId) return;
            await playerRedisModule.lockPlayer(rrId);
            const playerData = await playerService.getPlayer(rrId);
            if (playerData.error) {
                return;
            }

            pmService.sendMessage({
                rrId,
                message: CONFIGS.LOCALIZATION[playerData.lang].startInst(),
            });

            setTimeout(() => {
                pmService.sendMessage({
                    rrId,
                    message: CONFIGS.LOCALIZATION[playerData.lang].startInst2(),
                });
            }, 1500);
        } catch (e) {
            console.error('getStartInstruction err => ', e);
        } finally {
            await playerRedisModule.unlockPlayer(rrId);
        }
    },

    async changeLanguage({ rrId, lang }) {
        try {
            if (!rrId || !lang) return;

            await playerRedisModule.lockPlayer(rrId);
            const playerData = await playerService.getPlayer(rrId);
            if (playerData.error) {
                return;
            }

            playerData.lang = lang;
            await playerPostgreModule.updatePlayer(
                rrId,
                {
                    lang,
                },
            );

            pmService.sendMessage({
                rrId,
                message: CONFIGS.LOCALIZATION[playerData.lang].changeLangSucc(),
            });
            await playerRedisModule.updatePlayer(playerData);
        } catch (e) {
            console.error('getStartInstruction err => ', e);
        } finally {
            await playerRedisModule.unlockPlayer(rrId);
        }
    },

    async help({ rrId }) {
        try {
            if (!rrId) return;

            await playerRedisModule.lockPlayer(rrId);
            const playerData = await playerService.getPlayer(rrId);
            if (playerData.error) {
                return;
            }

            pmService.sendMessage({
                rrId,
                message: CONFIGS.LOCALIZATION[playerData.lang].help(),
            });
            await playerRedisModule.updatePlayer(playerData);
        } catch (e) {
            console.error('help err => ', e);
        } finally {
            await playerRedisModule.unlockPlayer(rrId);
        }
    },

    async rakeTransfer({ rrId }) {
        try {
            await playerRedisModule.lockPlayer(rrId);

            const noTransferredRooms = await roomPostgreModule.getAllNotTransferredRooms();
            let totalRakeSum = 0;
            const transferedRoomsUpdateRequests = [];

            for (let i = 0; i < noTransferredRooms.length; i += 1) {
                totalRakeSum += Number(noTransferredRooms[i].total_rake);
                transferedRoomsUpdateRequests.push(
                    roomPostgreModule.updateRoom(noTransferredRooms[i].id, {
                        is_rake_transferred: true,
                    }),
                );
            }

            await Promise.all(transferedRoomsUpdateRequests);

            const playerData = await playerService.getPlayer(rrId);

            const transactionData = transactionsHelpaer.createTransactionData(
                playerData,
                totalRakeSum,
                CONFIGS.TRNASACTIONS_KINDS.RAKE_TRANSFER,
                `player ${rrId} ${CONFIGS.TRNASACTIONS_KINDS.RAKE_TRANSFER} done`,
            );

            await transactionsPostgreModule.createTransaction(transactionData);

            playerData.balance += totalRakeSum;

            await playerPostgreModule.updateBalance(rrId, playerData.balance);

            await playerRedisModule.updatePlayer(playerData);
            console.log(JSON.stringify({
                msg: 'rakeTransfer success',
                data: {
                    totalRakeSum,
                },
            }));
        } catch (e) {
            console.error('rakeTransfer err => ', e);
        } finally {
            await playerRedisModule.unlockPlayer(rrId);
        }
    },
};
