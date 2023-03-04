export default {
    async createTransaction(data) {
        try {
            const postgreResponse = await DB(CONFIGS.TABLES.TRANSACTIONS)
                .insert({
                    ...data,
                    created_at: new Date(),
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
};
