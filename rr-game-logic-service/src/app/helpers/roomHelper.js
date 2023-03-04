export default {
    canCreate(playerData, bet) {
        if (playerData.roomId) {
            return { error: true, reason: 0 };
        }
        if (Number(bet) < CONFIGS.MIN_BET) {
            return { error: true, reason: 1 };
        }
        if (Number(playerData.balance) < Number(bet)) {
            return { error: true, reason: 2 };
        }

        return { error: false };
    },

    createRoomPgData(playerData, bet) {
        return {
            state: CONFIGS.ROOM_STATE.CREATED,
            kind: CONFIGS.ROOM_KIND.CLASSIC,
            owner_id: playerData.rrId,
            bet: Number(bet),
            created_at: new Date(),
            updated_at: new Date(),
            is_rake_transferred: false,
        };
    },

    createRoomRedisData(id, roomMysqlData, name, lang) {
        return {
            id,
            state: roomMysqlData.state,
            kind: roomMysqlData.kind,
            ownerId: roomMysqlData.owner_id,
            ownerName: name,
            opponentId: null,
            opponentName: null,
            lang,
            bet: roomMysqlData.bet,
            created_at: roomMysqlData.created_at,
            updated_at: roomMysqlData.updated_at,
            ttl: 180,
        };
    },

    canJoin(playerData, roomData) {
        if (!playerData.id || !roomData.id) {
            return { error: true, reason: 0 };
        }

        if (roomData.opponentId) {
            return { error: true, reason: 3 };
        }

        if (roomData.state !== CONFIGS.ROOM_STATE.CREATED) {
            return { error: true, reason: 3 };
        }

        if (playerData.roomId) {
            return { error: true, reason: 5 };
        }

        if (Number(playerData.balance) < Number(roomData.bet)) {
            return { error: true, reason: 2 };
        }

        return { error: false };
    },

    joinRoom(roomData, id, name) {
        const newRoomData = { ...roomData };

        newRoomData.state = CONFIGS.ROOM_STATE.STARTED;
        newRoomData.opponentId = id;
        newRoomData.opponentName = name;

        return newRoomData;
    },

    game(ownerId, opponentId) {
        const dices = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];

        const data = {
            dices,
            winnerId: 0,
            looserId: 0,
        };

        if (dices[0] > dices[1]) {
            data.winnerId = ownerId;
            data.looserId = opponentId;
        } else if (dices[0] < dices[1]) {
            data.winnerId = opponentId;
            data.looserId = ownerId;
        }

        return data;
    },

    financeLogic(roomData, gameData) {
        if (!gameData.looserId && !gameData.winnerId) {
            return {
                isRefund: true,
                refaundAmount: roomData.bet,
            };
        }

        const rake = (Number(roomData.bet) * 2) * CONFIGS.RAKE;
        return {
            isRefund: false,
            winAmount: (Number(roomData.bet) * 2) - rake,
            totalRake: rake,
        };
    },

    betTKConvertor(bet) {
        return Number(String(bet)
            .replace(/T/g, '000000000000').replace(/t/g, '000000000000').replace(/K/g, '000')
            .replace(/k/g, '000'));
    },
};
