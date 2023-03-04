export default {
    async giveWarn(data) {
        try {
            const postgreResponse = await DB(CONFIGS.TABLES.WARNINGS)
                .insert({
                    ...data,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            return postgreResponse;
        } catch (e) {
            console.error('giveWarn err => ', e);
            return {
                error: true,
                e,
            };
        }
    },

    async getActiveWarnings() {
        try {
            const postgreResponse = await DB(CONFIGS.TABLES.WARNINGS)
                .select('*')
                .where({
                    is_active: true,
                });
            return postgreResponse;
        } catch (e) {
            console.error('getActiveWarnings err => ', e);
            return {
                error: true,
                e,
            };
        }
    },

    async getPlayerWarning(recipientId) {
        try {
            const postgreResponse = await DB(CONFIGS.TABLES.WARNINGS)
                .select('*')
                .where({
                    is_active: true,
                    recipient_id: recipientId,
                });
            return postgreResponse;
        } catch (e) {
            console.error('getPlayerWarning err => ', e);
            return {
                error: true,
                e,
            };
        }
    },

    async deactivateWarning(recipientId, data) {
        try {
            const postgreResponse = await DB(CONFIGS.TABLES.WARNINGS)
                .update({
                    ...data,
                    updated_at: new Date(),
                })
                .where({
                    recipient_id: recipientId,
                });
            return postgreResponse;
        } catch (e) {
            console.error('deactivateWarning err => ', e);
            return {
                error: true,
                e,
            };
        }
    },
};
