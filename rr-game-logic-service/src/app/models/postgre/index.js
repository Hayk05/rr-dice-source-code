import knex from 'knex';

export default {
    connect() {
        const configs = {
            client: 'pg',
            connection: CONFIGS.POSTGRE_CONNECTION,
        };
        global.DB = knex(configs);
        return new Promise((res, rej) => {
            DB.raw('select 1+1 as result').then(res).catch((err) => {
                console.error('MYSQL DB connect error', err);
                rej(err);
            });
        });
    },

};
