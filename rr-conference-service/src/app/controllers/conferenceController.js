/* eslint-disable no-useless-escape */
import conferenceHelper from '../helpers/conferenceHelper';
import conferenceRedisModule from '../models/redis/conferenceRedisModule';
import notificationService from '../services/notificationService';

export default {
    async messagesParser() {
        try {
            await conferenceRedisModule.lockRoom();

            if (await conferenceRedisModule.isPageBlock()) return;
            const pg = (await BROWSER.pages())[0];

            await pg.waitForSelector('.chat_lines.tc');

            const messages = await pg.$$('.chat_lines.tc');

            const parsedMessages = [];
            for (let i = 1; i < messages.length; i += 1) {
                const rrId = await (await messages[i].$('.tran_chat')).evaluate((el) => el.getAttribute('show'));

                const data = { rrId };
                data.name = await (await messages[i].$('.chat_link')).evaluate((el) => el.innerText);
                data.date = (await (await messages[i].$('.chat_dates')).evaluate((el) => el.innerText))
                    .replace(',', '');
                data.text = (await (await messages[i].$('.tran_chat')).evaluate((el) => el.innerText))
                    .replace(/\n/g, '');

                parsedMessages.push(data);
            }

            if (!parsedMessages.length) return;

            const lastMessage = await conferenceRedisModule.getLastMessage();

            let newMessages = [];
            const index = conferenceHelper.getLastMessageIndex(lastMessage, parsedMessages);

            if (index === -1) {
                await conferenceRedisModule.setLastMessage(parsedMessages[parsedMessages.length - 1]);
                return;
            }

            newMessages = parsedMessages.slice(index + 1);

            const l = newMessages.length - 1;
            for (let i = 0; i < newMessages.length; i += 1) {
                notificationService.sendNotification(
                    CONFIGS.NOTIFICATIONS.COMMAND_HENDLER,
                    newMessages[i],
                );

                if (i === l) {
                    await conferenceRedisModule.setLastMessage(newMessages[i]);
                }
            }
        } catch (e) {
            console.error('messagesParser err => ', e);
        } finally {
            await conferenceRedisModule.unlockRoom();
        }
    },

    async updateConferencePage() {
        try {
            await conferenceRedisModule.lockRoom();
            const pg = (await BROWSER.pages())[0];

            await pg.goto(CONFIGS.URLS.CONFERENCE);

            await pg.waitForSelector('.chat_lines.tc');

            await conferenceRedisModule.addPageBlock();
        } catch (e) {
            console.error('updateConferencePage err => ', e);
        } finally {
            await conferenceRedisModule.unlockRoom();
        }
    },

    async giveMute({ recipientId }) {
        try {
            await conferenceRedisModule.lockRoom();

            const pg = (await BROWSER.pages())[0];

            await pg.waitForSelector('.jspContainer');

            const plList = await (await pg.$('.jspContainer')).$$('.float_left.small.tc.invited_list_in');

            for (let i = 0; i < plList.length; i += 1) {
                const rrId = (await (await plList[i].$('.konf_link.hov2.pointer.float_left'))
                    .evaluate((el) => el.getAttribute('action'))).replace(/[^\d\+]/g, '');
                if (Number(rrId) === Number(recipientId)) {
                    console.log(rrId);
                    await (await plList[i].$('.hov.pointer.tip.float_left')).click();
                    return;
                }
            }
        } catch (e) {
            console.error('giveMute err => ', e);
        } finally {
            await conferenceRedisModule.unlockRoom();
        }
    },

    async sendMessage({ message }) {
        try {
            await conferenceRedisModule.lockRoom();
            if (await conferenceRedisModule.isPageBlock()) return;

            const pg = (await BROWSER.pages())[0];

            // await pg.goto(CONFIGS.URLS.CONFERENCE);

            await pg.waitForSelector('#message');

            await pg.$('#message');

            await pg.keyboard.sendCharacter(message);

            await pg.waitForTimeout(100);

            await pg.keyboard.down('ControlLeft');

            await pg.keyboard.press('Enter');

            await pg.waitForTimeout(1000);
        } catch (e) {
            console.error('sendMessage err => ', e);
        } finally {
            await conferenceRedisModule.unlockRoom();
        }
    },
};
