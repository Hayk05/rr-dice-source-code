export default {
    async getPlayerByRR(rrId) {
        try {
            const postgreResponse = await DB(CONFIGS.TABLES.PLAYERS)
                .select('*')
                .where({
                    rr_id: rrId,
                });

            if (!postgreResponse.length) {
                return {};
            }

            return postgreResponse[0];
        } catch (e) {
            console.error('getPlayerByRR err => ', e);
            return {
                error: true,
                e,
            };
        }
    },

    async insertPlayer(rrId) {
        try {
            const postgreResponse = await DB(CONFIGS.TABLES.PLAYERS)
                .returning('id')
                .insert({
                    rr_id: rrId,
                    lang: 'en',
                    created_at: new Date(),
                    updated_at: new Date(),
                });

            if (!postgreResponse.length) {
                return {
                    error: true,
                };
            }

            return postgreResponse[0];
        } catch (e) {
            console.error('insertPlayer err => ', e);
            return {
                error: true,
                e,
            };
        }
    },

    async updateBalance(rrId, amount) {
        try {
            const postgreResponse = await DB(CONFIGS.TABLES.PLAYERS)
                .update({
                    balance: amount,
                    updated_at: new Date(),
                })
                .where({
                    rr_id: rrId,
                });
            return postgreResponse;
        } catch (e) {
            console.error('updateBalance err => ', e);
            return {
                error: true,
                e,
            };
        }
    },

    async updatePlayer(rrId, data) {
        try {
            const postgreResponse = await DB(CONFIGS.TABLES.PLAYERS)
                .update({
                    ...data,
                    updated_at: new Date(),
                })
                .where({
                    rr_id: rrId,
                });
            return postgreResponse;
        } catch (e) {
            console.error('updatePlayer err => ', e);
            return {
                error: true,
                e,
            };
        }
    },
};
