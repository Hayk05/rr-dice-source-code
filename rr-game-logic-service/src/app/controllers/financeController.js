import frontHelper from '../helpers/frontHelper';
import roomHelper from '../helpers/roomHelper';
import transactionsHelpaer from '../helpers/transactionsHelpaer';
import playerPostgreModule from '../models/postgre/playerPostgreModule';
import transactionsPostgreModule from '../models/postgre/transactionsPostgreModule';
import playerRedisModule from '../models/redis/playerRedisModule';
import paymentService from '../services/paymentService';
import playerService from '../services/playerService';
import pmService from '../services/pmService';

export default {
    async deposit({ rrId, amount }) {
        try {
            if (!rrId || !amount) {
                console.error(JSON.stringify({
                    msg: 'deposit failed',
                    data: { rrId, amount },
                }));
                return;
            }

            const aformated = roomHelper.betTKConvertor(amount);
            await playerRedisModule.lockPlayer(rrId);

            const playerData = await playerService.getPlayer(rrId);

            if (playerData.error) {
                console.error(JSON.stringify({
                    msg: 'deposit failed getplayer',
                    data: playerData,
                }));

                pmService.sendMessage({
                    rrId,
                    message: CONFIGS.LOCALIZATION.en.ss(),
                });
                return;
            }

            playerData.balance += aformated;

            const postgreResponse = await playerPostgreModule.updateBalance(rrId, playerData.balance);

            if (postgreResponse.error) {
                console.error(JSON.stringify({
                    msg: 'deposit failed updateBalance',
                    data: postgreResponse,
                }));

                pmService.sendMessage({
                    rrId,
                    message: CONFIGS.LOCALIZATION[playerData.lang].ss(),
                });
                return;
            }

            const transactionData = transactionsHelpaer.createTransactionData(
                playerData,
                aformated,
                CONFIGS.TRNASACTIONS_KINDS.DEPOSIT,
                `player ${rrId} ${CONFIGS.TRNASACTIONS_KINDS.DEPOSIT} done`,
            );

            const transactionResponse = await transactionsPostgreModule.createTransaction(transactionData);

            if (transactionResponse.error) {
                console.error(JSON.stringify({
                    msg: 'deposit failed transactionResponse',
                    data: transactionResponse,
                }));
            }

            await playerRedisModule.updatePlayer(playerData);
            pmService.sendMessage({
                rrId,
                message: CONFIGS.LOCALIZATION[playerData.lang].deposit(frontHelper.moneyRawFormater(aformated)),
            });

            console.log(JSON.stringify({
                msg: 'deposit success',
                data: { rrId, amount },
            }));
        } catch (e) {
            console.error('depositTranzaction err =>  ', e);
            pmService.sendMessage({
                rrId,
                message: CONFIGS.LOCALIZATION.en.ss(),
            });
        } finally {
            await playerRedisModule.unlockPlayer(rrId);
        }
    },

    async withdrawal({ rrId, amount }) {
        try {
            if (!rrId || !amount) {
                console.error(JSON.stringify({
                    msg: 'withdrawal failed',
                    data: { rrId, amount },
                }));
                return;
            }

            await playerRedisModule.lockPlayer(rrId);

            const aformated = roomHelper.betTKConvertor(amount);

            const playerData = await playerService.getPlayer(rrId);

            if (Number(aformated) <= 0) {
                console.error(JSON.stringify({
                    msg: 'withdrawal failed aformated',
                    data: { rrId, amount },
                }));

                pmService.sendMessage({
                    rrId,
                    message: CONFIGS.LOCALIZATION.en.ss(),
                });
                return;
            }
            if (Number(playerData.balance) < Number(aformated)) {
                console.error(JSON.stringify({
                    msg: 'withdrawal failed balance',
                    data: { rrId, amount, balance: playerData.balance },
                }));

                pmService.sendMessage({
                    rrId,
                    message: CONFIGS.LOCALIZATION[playerData.lang].balancErr(),
                });
                return;
            }

            if (playerData.error) {
                console.error(JSON.stringify({
                    msg: 'withdrawal failed getplayer',
                    data: playerData,
                }));

                pmService.sendMessage({
                    rrId,
                    message: CONFIGS.LOCALIZATION[playerData.lang].ss(),
                });

                return;
            }

            playerData.balance -= aformated;

            const postgreResponse = await playerPostgreModule.updateBalance(rrId, playerData.balance);

            if (postgreResponse.error) {
                console.error(JSON.stringify({
                    msg: 'withdrawal failed postgreResponse',
                    data: postgreResponse,
                }));

                pmService.sendMessage({
                    rrId,
                    message: CONFIGS.LOCALIZATION[playerData.lang].ss(),
                });

                return;
            }

            const transactionData = transactionsHelpaer.createTransactionData(
                playerData,
                aformated,
                CONFIGS.TRNASACTIONS_KINDS.WITHDRAWAL,
                `player ${rrId} ${CONFIGS.TRNASACTIONS_KINDS.WITHDRAWAL} done`,
            );

            const transactionResponse = await transactionsPostgreModule.createTransaction(transactionData);

            if (transactionResponse.error) {
                console.error(JSON.stringify({
                    msg: 'withdrawal failed transactionResponse',
                    data: transactionResponse,
                }));
                return;
            }

            await playerRedisModule.updatePlayer(playerData);

            const paymentServiceResponse = await paymentService.withdrawal({ rrId, amount: aformated });
            console.log(paymentServiceResponse);
            if (!paymentServiceResponse) {
                console.error(JSON.stringify({
                    msg: 'withdrawal failed paymentServiceResponse',
                    data: paymentServiceResponse,
                }));

                pmService.sendMessage({
                    rrId,
                    message: CONFIGS.LOCALIZATION[playerData.lang].ss(),
                });
                return;
            }

            pmService.sendMessage({
                rrId,
                message: CONFIGS.LOCALIZATION[playerData.lang].withdrawal(frontHelper.moneyRawFormater(aformated)),
            });

            console.log(JSON.stringify({
                msg: 'withdrawal success',
                data: { rrId, amount },
            }));
        } catch (e) {
            console.error('withdrawal err =>  ', e);
            pmService.sendMessage({
                rrId,
                message: CONFIGS.LOCALIZATION.en.ss(),
            });
        } finally {
            await playerRedisModule.unlockPlayer(rrId);
        }
    },

    async getBalance({ rrId }) {
        try {
            console.log('rrId => ', rrId);
            if (!rrId) {
                console.error(JSON.stringify({
                    msg: 'getBalance failed',
                    data: { rrId },
                }));
                return;
            }

            await playerRedisModule.lockPlayer(rrId);

            const playerData = await playerService.getPlayer(rrId);

            if (playerData.error) {
                console.error(JSON.stringify({
                    msg: 'getBalance failed getplayer',
                    data: playerData,
                }));

                pmService.sendMessage({
                    rrId,
                    message: CONFIGS.LOCALIZATION.en.ss(),
                });

                return;
            }

            console.log(JSON.stringify({
                msg: 'getBalance success',
                data: { rrId },
            }));

            pmService.sendMessage({
                rrId,
                message: CONFIGS.LOCALIZATION[playerData.lang]
                    .balance(frontHelper.moneyRawFormater(playerData.balance)),
            });
        } catch (e) {
            console.error('getBalance err => ', e);
            pmService.sendMessage({
                rrId,
                message: CONFIGS.LOCALIZATION.en.ss(),
            });
        } finally {
            await playerRedisModule.unlockPlayer(rrId);
        }
    },

    async bet({ playerData, bet }) {
        try {
            const newPlayerData = { ...playerData };
            if (Number(playerData.balance) < Number(bet)) {
                return { error: true, reason: 0 };
            }

            newPlayerData.balance -= bet;

            const postgreResponse = await playerPostgreModule.updateBalance(newPlayerData.rrId, newPlayerData.balance);

            if (postgreResponse.error) return { error: true, reason: 1 };

            const transactionData = transactionsHelpaer.createTransactionData(
                playerData,
                bet,
                CONFIGS.TRNASACTIONS_KINDS.BET,
                `player ${newPlayerData.rrId} ${CONFIGS.TRNASACTIONS_KINDS.BET} done`,
            );

            await transactionsPostgreModule.createTransaction(transactionData);
            await playerRedisModule.updatePlayer(newPlayerData);

            console.log(JSON.stringify({
                msg: 'bet success',
                data: { playerData, bet },
            }));

            return { error: false, data: newPlayerData };
        } catch (e) {
            console.error('bet err =>  ', e);
            return { error: true, reason: 1 };
        }
    },

    async refund({ rrId, amount }) {
        try {
            if (!rrId || !amount) {
                console.error(JSON.stringify({
                    msg: 'refund failed',
                    data: { rrId, amount },
                }));
                return;
            }

            await playerRedisModule.lockPlayer(rrId);

            const playerData = await playerService.getPlayer(rrId);

            if (playerData.error) {
                console.error(JSON.stringify({
                    msg: 'refund failed getplayer',
                    data: playerData,
                }));

                pmService.sendMessage({
                    rrId,
                    message: CONFIGS.LOCALIZATION.en.ss(),
                });

                return;
            }

            playerData.balance += amount;

            const postgreResponse = await playerPostgreModule.updateBalance(rrId, playerData.balance);

            if (postgreResponse.error) {
                console.error(JSON.stringify({
                    msg: 'refund failed postgreResponse',
                    data: postgreResponse,
                }));

                pmService.sendMessage({
                    rrId,
                    message: CONFIGS.LOCALIZATION[playerData.lang].ss(),
                });
                return;
            }

            const transactionData = transactionsHelpaer.createTransactionData(
                playerData,
                amount,
                CONFIGS.TRNASACTIONS_KINDS.REFUND,
                `player ${rrId} ${CONFIGS.TRNASACTIONS_KINDS.REFUND} done`,
            );

            const transactionResponse = await transactionsPostgreModule.createTransaction(transactionData);

            if (transactionResponse.error) {
                console.error(JSON.stringify({
                    msg: 'refund failed transactionResponse',
                    data: transactionResponse,
                }));
                return;
            }

            console.log(JSON.stringify({
                msg: 'refund success',
                data: { rrId, amount },
            }));

            await playerRedisModule.updatePlayer(playerData);
        } catch (e) {
            console.error('refund err =>  ', e);
            pmService.sendMessage({
                rrId,
                message: CONFIGS.LOCALIZATION.en.ss(),
            });
        } finally {
            await playerRedisModule.unlockPlayer(rrId);
        }
    },

    async win({ rrId, amount }) {
        try {
            if (!rrId || !amount) {
                console.error(JSON.stringify({
                    msg: 'win failed',
                    data: { rrId, amount },
                }));
                return;
            }

            await playerRedisModule.lockPlayer(rrId);

            const playerData = await playerService.getPlayer(rrId);

            if (playerData.error) {
                console.error(JSON.stringify({
                    msg: 'win failed getplayer',
                    data: playerData,
                }));

                pmService.sendMessage({
                    rrId,
                    message: CONFIGS.LOCALIZATION.en.ss(),
                });
                return;
            }

            playerData.balance += amount;

            const postgreResponse = await playerPostgreModule.updateBalance(rrId, playerData.balance);

            if (postgreResponse.error) {
                console.error(JSON.stringify({
                    msg: 'win failed postgreResponse',
                    data: postgreResponse,
                }));

                pmService.sendMessage({
                    rrId,
                    message: CONFIGS.LOCALIZATION[playerData.lang].ss(),
                });
                return;
            }

            const transactionData = transactionsHelpaer.createTransactionData(
                playerData,
                amount,
                CONFIGS.TRNASACTIONS_KINDS.WIN,
                `player ${rrId} ${CONFIGS.TRNASACTIONS_KINDS.WIN} done`,
            );

            const transactionResponse = await transactionsPostgreModule.createTransaction(transactionData);

            if (transactionResponse.error) {
                console.error(JSON.stringify({
                    msg: 'win failed transactionResponse',
                    data: transactionResponse,
                }));
                return;
            }

            console.log(JSON.stringify({
                msg: 'win success',
                data: { rrId, amount },
            }));

            await playerRedisModule.updatePlayer(playerData);
        } catch (e) {
            console.error('win err =>  ', e);
            pmService.sendMessage({
                rrId,
                message: CONFIGS.LOCALIZATION.en.ss(),
            });
        } finally {
            await playerRedisModule.unlockPlayer(rrId);
        }
    },
};
