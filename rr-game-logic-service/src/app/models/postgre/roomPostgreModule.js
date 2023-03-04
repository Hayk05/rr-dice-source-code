export default {
    async createRoom(data) {
        try {
            const postgreResponse = await DB(CONFIGS.TABLES.ROOM)
                .returning('id')
                .insert({
                    ...data,
                });
            if (!postgreResponse.length) {
                return {
                    error: true,
                };
            }

            return postgreResponse[0];
        } catch (e) {
            console.error('createRoom err => ', e);
            return {
                error: true,
                e,
            };
        }
    },

    async updateRoom(roomId, data) {
        try {
            const postgreResponse = await DB(CONFIGS.TABLES.ROOM)
                .update({
                    ...data,
                    updated_at: new Date(),
                })
                .where({
                    id: roomId,
                });
            return postgreResponse;
        } catch (e) {
            console.error('updateRoom err => ', e);
            return {
                error: true,
                e,
            };
        }
    },

    async getAllNotTransferredRooms() {
        try {
            const postgreResponse = await DB(CONFIGS.TABLES.ROOM)
                .select('*')
                .where({
                    state: CONFIGS.ROOM_STATE.FINISHED,
                    is_rake_transferred: false,
                });
            return postgreResponse;
        } catch (e) {
            console.error('getAllNotTransferredRooms err => ', e);
            return {
                error: true,
                e,
            };
        }
    },
};
