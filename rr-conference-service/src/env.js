import dotenv from 'dotenv';

let env = '.dev';
if (process.env.NODE_ENV) {
    env = `.${process.env.NODE_ENV}`;
}
const path = `${process.cwd()}/.env${env}`;
dotenv.config({ path });
console.log(path);
global.CONFIGS = require('./config').default;
