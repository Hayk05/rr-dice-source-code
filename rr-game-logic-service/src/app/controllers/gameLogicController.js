import moment from 'moment';
import roomHelper from '../helpers/roomHelper';
import roomPostgreModule from '../models/postgre/roomPostgreModule';
import playerRedisModule from '../models/redis/playerRedisModule';
import roomRedisModule from '../models/redis/roomRedisModule';
import conferenceService from '../services/conferenceService';
import notificationService from '../services/notificationService';
import playerService from '../services/playerService';
import financeController from './financeController';
import frontHelper from '../helpers/frontHelper';
import timerService from '../services/timerService';

export default {
    async createRoom({
        rrId, bet, name, lang,
    }) {
        try {
            if (!rrId || !bet || !name || !lang) {
                console.error(JSON.stringify({
                    msg: 'createRoom failed',
                    data: {
                        rrId, bet, name, lang,
                    },
                }));
                return;
            }

            await playerRedisModule.lockPlayer(rrId);

            const convertedBet = roomHelper.betTKConvertor(bet);

            let playerData = await playerService.getPlayer(rrId);

            if (playerData.error) {
                console.error(JSON.stringify({
                    msg: 'createRoom failed getplayer',
                    data: playerData,
                }));

                conferenceService.sendMessage(lang, {
                    message: CONFIGS.LOCALIZATION[lang].ssc(name),
                });
                return;
            }

            const isCanCreate = roomHelper.canCreate(playerData, convertedBet);
            if (isCanCreate.error) {
                if (isCanCreate.reason === 0) {
                    conferenceService.sendMessage(lang, {
                        message: CONFIGS.LOCALIZATION[lang].ssc(name),
                    });
                } else if (isCanCreate.reason === 1) {
                    conferenceService.sendMessage(lang, {
                        message: CONFIGS.LOCALIZATION[lang].minBetErr(name),
                    });
                } else if (isCanCreate.reason === 2) {
                    conferenceService.sendMessage(lang, {
                        message: CONFIGS.LOCALIZATION[lang].balancErrConff(name),
                    });
                }
                console.error(JSON.stringify({
                    msg: 'createRoom failed isCanCreate',
                    data: {
                        rrId, bet, name, lang,
                    },
                }));
                return;
            }

            const financeResponse = await financeController.bet({ playerData, bet: convertedBet });
            if (financeResponse.error) {
                conferenceService.sendMessage(lang, {
                    message: CONFIGS.LOCALIZATION[lang].ssc(name),
                });
                console.error(JSON.stringify({
                    msg: 'createRoom failed financeResponse',
                    data: financeResponse,
                }));
                return;
            }

            playerData = financeResponse.data;

            const roomMysqlData = roomHelper.createRoomPgData(playerData, convertedBet);

            const pgResponse = await roomPostgreModule.createRoom(roomMysqlData);
            if (pgResponse.error) {
                conferenceService.sendMessage(lang, {
                    message: CONFIGS.LOCALIZATION[lang].ssc(name),
                });
                console.error(JSON.stringify({
                    msg: 'createRoom failed pgResponse',
                    data: financeResponse,
                }));
                return;
            }

            const roomData = roomHelper.createRoomRedisData(pgResponse.id, roomMysqlData, name, lang);
            playerData.roomId = pgResponse.id;

            const frontData = frontHelper.generateRoomFrontData(roomData);
            await roomRedisModule.updateRoom(roomData, frontData);
            await playerRedisModule.updatePlayer(playerData);

            await timerService.addTimer(
                playerData.roomId,
                moment(new Date()).add(1, 's').toDate(),
            );

            conferenceService.sendMessage(lang, {
                message: CONFIGS.LOCALIZATION[lang]
                    .createRoomSuccess({
                        name,
                        bet: frontHelper.moneyRawFormater(convertedBet),
                        roomId: roomData.id,
                    }),
            });

            notificationService.sendNotification(
                CONFIGS.NOTIFICATIONS.GET_ROOM_LIST,
                {
                    lang,
                },
            );
            console.log(JSON.stringify({
                msg: 'createRoom success',
                data: {
                    rrId, bet, name, lang,
                },
            }));
        } catch (e) {
            console.error('createRoom err => ', e, rrId, bet, name, lang);
            conferenceService.sendMessage(lang, {
                message: CONFIGS.LOCALIZATION[lang].ssc(name),
            });
        } finally {
            await playerRedisModule.unlockPlayer(rrId);
        }
    },

    async joinRoom({
        rrId, roomId, name, lang,
    }) {
        try {
            if (!rrId || !roomId || !name) {
                console.error(JSON.stringify({
                    msg: 'createRoom failed',
                    data: {
                        rrId, roomId, name,
                    },
                }));
                return;
            }

            await playerRedisModule.lockPlayer(rrId);
            await roomRedisModule.lockRoom(roomId);

            let playerData = await playerService.getPlayer(rrId);
            let roomData = await roomRedisModule.getRoom(roomId);

            const isCanJoin = roomHelper.canJoin(playerData, roomData);
            if (isCanJoin.error) {
                if (isCanJoin.reason === 0) {
                    conferenceService.sendMessage(lang, {
                        message: CONFIGS.LOCALIZATION[lang].ssc(name),
                    });
                } else if (isCanJoin.reason === 3) {
                    conferenceService.sendMessage(lang, {
                        message: CONFIGS.LOCALIZATION[lang].roomStErr(name),
                    });
                } else if (isCanJoin.reason === 2) {
                    conferenceService.sendMessage(lang, {
                        message: CONFIGS.LOCALIZATION[lang].balancErrConff(name),
                    });
                } else if (isCanJoin.reason === 5) {
                    conferenceService.sendMessage(lang, {
                        message: CONFIGS.LOCALIZATION[lang].haveRoomErr(name),
                    });
                }
                console.error(JSON.stringify({
                    msg: 'joinRoom failed isCanJoin',
                    data: {
                        rrId, name, roomId, lang,
                    },
                }));
                return;
            }

            const financeResponse = await financeController.bet({ playerData, bet: roomData.bet });
            if (financeResponse.error) {
                conferenceService.sendMessage(lang, {
                    message: CONFIGS.LOCALIZATION[lang].ssc(name),
                });
                console.error(JSON.stringify({
                    msg: 'joinRoom failed financeResponse',
                    data: financeResponse,
                }));
                return;
            }

            playerData = financeResponse.data;
            playerData.roomId = roomId;

            roomData = roomHelper.joinRoom(roomData, playerData.rrId, name);

            const postgreResponse = await roomPostgreModule.updateRoom(roomData.id, {
                state: roomData.state,
                opponent_id: roomData.opponentId,
            });
            if (postgreResponse.error) {
                conferenceService.sendMessage(lang, {
                    message: CONFIGS.LOCALIZATION[lang].ssc(name),
                });
                console.error(JSON.stringify({
                    msg: 'joinRoom failed postgreResponse',
                    data: postgreResponse,
                }));
                return;
            }

            const frontData = frontHelper.generateRoomFrontData(roomData);
            await roomRedisModule.updateRoom(roomData, frontData);
            await playerRedisModule.updatePlayer(playerData);

            setTimeout(() => {
                notificationService.sendNotification(
                    CONFIGS.NOTIFICATIONS.GAME,
                    {
                        roomId,
                    },
                );
            }, 200);

            console.log(JSON.stringify({
                msg: 'joinRoom success',
                data: {
                    rrId, name, lang,
                },
            }));
        } catch (e) {
            console.error('joinRoom err => ', e, rrId, name, lang);
            conferenceService.sendMessage(lang, {
                message: CONFIGS.LOCALIZATION[lang].ssc(name),
            });
        } finally {
            await playerRedisModule.unlockPlayer(rrId);
            await roomRedisModule.unlockRoom(roomId);
        }
    },

    async game({ roomId }) {
        try {
            await roomRedisModule.lockRoom(roomId);

            const roomData = await roomRedisModule.getRoom(roomId);

            const gameData = roomHelper.game(roomData.ownerId, roomData.opponentId);

            notificationService.sendNotification(
                CONFIGS.NOTIFICATIONS.GAME_OVER,
                {
                    roomId,
                    gameData,
                },
            );
        } catch (e) {
            console.error('game err => ', e, roomId);
        } finally {
            await roomRedisModule.unlockRoom(roomId);
        }
    },

    async gameOver({ roomId, gameData }) {
        try {
            await roomRedisModule.lockRoom(roomId);

            const roomData = await roomRedisModule.getRoom(roomId);
            if (!roomData.id) {
                await roomPostgreModule.updateRoom(roomId, {
                    state: CONFIGS.ROOM_STATE.CRUSHED,
                });

                console.error(JSON.stringify({
                    msg: 'gameOver failed roomData => ',
                    data: {
                        roomId, gameData, roomData,
                    },
                }));

                return;
            }

            const shqama = roomHelper.financeLogic(roomData, gameData);

            if (shqama.isRefund) {
                notificationService.sendNotification(
                    CONFIGS.NOTIFICATIONS.REFUND,
                    {
                        rrId: roomData.ownerId,
                        amount: Number(shqama.refaundAmount),
                    },
                );
                notificationService.sendNotification(
                    CONFIGS.NOTIFICATIONS.REFUND,
                    {
                        rrId: roomData.opponentId,
                        amount: Number(shqama.refaundAmount),
                    },
                );
                await roomPostgreModule.updateRoom(roomId, {
                    state: CONFIGS.ROOM_STATE.DRAW,
                });

                conferenceService.sendMessage(roomData.lang, {
                    message: CONFIGS.LOCALIZATION[roomData.lang].draw(roomData, gameData),
                });
            } else {
                notificationService.sendNotification(
                    CONFIGS.NOTIFICATIONS.WIN,
                    {
                        rrId: gameData.winnerId,
                        amount: Number(shqama.winAmount),
                    },
                );
                await roomPostgreModule.updateRoom(roomId, {
                    state: CONFIGS.ROOM_STATE.FINISHED,
                    winner_id: gameData.winnerId,
                    total_rake: shqama.totalRake,
                    total_win: shqama.winAmount,
                });

                conferenceService.sendMessage(roomData.lang, {
                    message: CONFIGS.LOCALIZATION[roomData.lang].gameOver(
                        roomData, gameData, frontHelper.moneyRawFormater(shqama.winAmount),
                    ),
                });
            }

            await roomRedisModule.removeFromStack(roomId);
            await roomRedisModule.deletRoom(roomId);
            notificationService.sendNotification(
                CONFIGS.NOTIFICATIONS.DELETE_PLAYER_ROOM_ID,
                { rrId: roomData.ownerId },
            );
            notificationService.sendNotification(
                CONFIGS.NOTIFICATIONS.DELETE_PLAYER_ROOM_ID,
                { rrId: roomData.opponentId },
            );

            console.log(JSON.stringify({
                msg: 'gameOver success',
                data: { roomId, gameData },
            }));

            notificationService.sendNotification(
                CONFIGS.NOTIFICATIONS.GET_ROOM_LIST,
                {
                    lang: roomData.lang,
                },
            );

            await timerService.removeTimer(roomId);
        } catch (e) {
            console.error('gameOver err => ', e, roomId, gameData);
        } finally {
            await roomRedisModule.unlockRoom(roomId);
        }
    },

    async deleteRoom({ roomId, rrId, name }) {
        try {
            if (!roomId) {
                console.error(JSON.stringify({
                    msg: 'deleteRoom failed',
                    data: {
                        roomId,
                    },
                }));
                return;
            }
            await roomRedisModule.lockRoom(roomId);
            const roomData = await roomRedisModule.getRoom(roomId);

            if (roomData.state !== CONFIGS.ROOM_STATE.CREATED) {
                console.error(JSON.stringify({
                    msg: 'deleteRoom failed state',
                    data: {
                        roomId,
                        state: roomData.state,
                    },
                }));
                return;
            }
            if (rrId !== roomData.ownerId && rrId !== -1) {
                console.error(JSON.stringify({
                    msg: 'deleteRoom failed state',
                    data: {
                        roomId,
                        state: roomData.state,
                    },
                }));
                conferenceService.sendMessage(roomData.lang, {
                    message: CONFIGS.LOCALIZATION[roomData.lang].ssc(name),
                });
                return;
            }

            await roomPostgreModule.updateRoom(roomId, {
                state: CONFIGS.ROOM_STATE.DELETED,
            });

            await roomRedisModule.deletRoom(roomId);
            await roomRedisModule.removeFromStack(roomId);

            notificationService.sendNotification(
                CONFIGS.NOTIFICATIONS.DELETE_PLAYER_ROOM_ID,
                { rrId: roomData.ownerId },
            );

            notificationService.sendNotification(
                CONFIGS.NOTIFICATIONS.REFUND,
                {
                    rrId: roomData.ownerId,
                    amount: roomData.bet,
                },
            );

            conferenceService.sendMessage(
                roomData.lang,
                {
                    message: CONFIGS.LOCALIZATION[roomData.lang].deleteRoom(roomData),
                },
            );

            console.log(JSON.stringify({
                msg: 'deleteRoom success',
                data: { roomId, rrId },
            }));
        } catch (e) {
            console.error('deleteRoom err => ', e, roomId);
        } finally {
            await roomRedisModule.unlockRoom(roomId);
        }
    },

    async deletePlayerRoomId({ rrId }) {
        try {
            await playerRedisModule.lockPlayer(rrId);
            const playerData = await playerService.getPlayer(rrId);

            playerData.roomId = null;

            await playerRedisModule.updatePlayer(playerData);
        } catch (e) {
            console.error('deletePlayerRoomId err => ', e, rrId);
        } finally {
            await playerRedisModule.unlockPlayer(rrId);
        }
    },

    async getRoomList({ lang }) {
        try {
            const roomList = await roomRedisModule.getStack();

            const keys = Object.values(roomList);

            if (!keys.length) {
                conferenceService.sendMessage(lang, {
                    message: CONFIGS.LOCALIZATION[lang].noRooms(),
                });
                return;
            }

            let message = '========== : ID || OWNER || BET || TTL : ==========\n';
            for (let i = 0; i < keys.length; i += 1) {
                // eslint-disable-next-line max-len
                message += `${i + 1}) Room ${keys[i].id} || ${keys[i].ownerName} || ${frontHelper.moneyRawFormater(keys[i].bet)} || ${keys[i].ttl} seconds \n`;
            }

            message += '========== : ID || OWNER || BET || TTL : ========== \n';

            message += CONFIGS.LOCALIZATION[lang].ddComands();

            conferenceService.sendMessage(lang, {
                message,
            });
        } catch (e) {
            conferenceService.sendMessage(lang, {
                message: CONFIGS.LOCALIZATION[lang].ss(),
            });
            console.error('deletePlayerRoomId err => ', e, lang);
        }
    },

    async timerTrigger({ roomId }) {
        try {
            await roomRedisModule.lockRoom(roomId);

            const roomData = await roomRedisModule.getRoom(roomId);

            if (!roomData.id) return;

            roomData.ttl -= 1;

            if (roomData.ttl <= 0) {
                notificationService.sendNotification(
                    CONFIGS.NOTIFICATIONS.DELETE_ROOM,
                    {
                        roomId,
                        rrId: -1,
                    },
                );
            } else {
                await timerService.addTimer(
                    roomId,
                    moment(new Date()).add(1, 's').toDate(),
                );
            }

            const frontData = frontHelper.generateRoomFrontData(roomData);
            await roomRedisModule.updateRoom(roomData, frontData);
        } catch (e) {
            console.error('timerTrigger err => ', e, roomId);
        } finally {
            await roomRedisModule.unlockRoom(roomId);
        }
    },
};
