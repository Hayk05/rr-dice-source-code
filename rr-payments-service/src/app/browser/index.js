import { executablePath } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import paymentsRedisModule from '../models/redis/paymentsRedisModule';

export default {
    async init() {
        try {
            await paymentsRedisModule.lockRoom();
            await this.createBrowser();
            await this.setSessionCookie();
        } catch (e) {
            console.error('browser err => ', e);
        } finally {
            await paymentsRedisModule.unlockRoom();
        }
    },

    async createBrowser() {
        puppeteer.use(stealthPlugin());

        const launchConfigs = {};
        if (CONFIGS.LAUNCH_MODE === 'dev') {
            launchConfigs.headless = false;
            launchConfigs.executablePath = executablePath();
        } else if (CONFIGS.LAUNCH_MODE === 'prod') {
            launchConfigs.headless = true;
            launchConfigs.executablePath = '/usr/bin/google-chrome';
            launchConfigs.args = [
                '--use-gl=egl',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-sandbox',
            ];
            launchConfigs.ignoreDefaultArgs = ['--disable-extensions'];
        }
        console.log(launchConfigs);

        global.BROWSER = await puppeteer.launch(launchConfigs);
    },

    async setSessionCookie() {
        const pages = await BROWSER.pages();
        console.log(CONFIGS.BOT_SESSION);
        await pages[0].setCookie({
            url: CONFIGS.URLS.MAIN,
            name: 'PHPSESSID',
            value: CONFIGS.BOT_SESSION,
        });

        await pages[0].goto(CONFIGS.URLS.MAIN);
    },
};
