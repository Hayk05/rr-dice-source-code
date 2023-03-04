import redisPMessagesModule from '../models/redis/redisPMessagesModule';
import notificationService from '../services/notificationService';

export default {
    async pmHandler() {
        try {
            await redisPMessagesModule.lockPage();
            const pgs = await BROWSER.pages();
            const pg = pgs[0];
            await pg.goto(CONFIGS.URLS.PM);

            await pg.waitForSelector('.mess_lines.tc.ib.hov');

            const els = await pg.$$('.mess_lines.tc.ib.hov');

            for (let i = 0; i < els.length; i += 1) {
                const elStyle = Object.values((await (await els[i].getProperty('style')).jsonValue()));
                const isNewMessage = elStyle.findIndex((style) => style === 'opacity');

                if (isNewMessage === -1) {
                    const text = await els[i].evaluate((ell) => ell.innerText);

                    const elAtribute = await els[i].evaluate((ell) => ell.getAttribute('action'));
                    notificationService.sendNotification(CONFIGS.NOTIFICATIONS.COMMAND_HENDLER, {
                        text: text.split('\n')[2],
                        rrId: elAtribute.replace('slide/chat/user_', ''),
                    });
                }
            }
        } catch (e) {
            console.error('pmHandler err => ', e);
        } finally {
            await redisPMessagesModule.unlockPage();
        }
    },

    async sendPMMessage({ rrId, message }) {
        try {
            const pg = await BROWSER.newPage();

            await pg.goto(`${CONFIGS.URLS.PM}/${rrId}`);

            await pg.waitForSelector('#message');

            await pg.$('#message');

            await pg.keyboard.sendCharacter(message);

            await pg.waitForTimeout(100);

            await pg.keyboard.down('ControlLeft');

            await pg.keyboard.press('Enter');

            await pg.waitForTimeout(1000);

            await pg.close();
        } catch (e) {
            console.error('sendPMMessage err => ', e);
        }
    },
};
