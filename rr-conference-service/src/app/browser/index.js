import { executablePath } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';

export default {
    async init() {
        await this.createBrowser();
        await this.setSessionCookie();
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
        await pages[0].setCookie({
            url: CONFIGS.URLS.MAIN,
            name: 'PHPSESSID',
            value: CONFIGS.BOT_SESSION,
        });
    },
};
