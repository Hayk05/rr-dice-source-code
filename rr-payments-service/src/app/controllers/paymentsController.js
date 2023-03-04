/* eslint-disable no-useless-escape */
import paymentsHelper from '../helpers/paymentsHelper';
import paymentsRedisModule from '../models/redis/paymentsRedisModule';
import financeService from '../services/financeService';

export default {
    async paymentsChecker() {
        try {
            await paymentsRedisModule.lockRoom();
            const pg = (await BROWSER.pages())[0];

            await pg.goto(CONFIGS.URLS.MONEY_LOG);

            const payments = await pg.$$('tr');

            if (!payments.length) return;
            let parsedPayments = [];
            for (let i = 0; i < payments.length; i += 1) {
                const data = {};
                const elm = await payments[i].$('.money_log.white');
                if (!elm) continue;
                let moneyLog = await elm.evaluate((el) => el.innerText);
                moneyLog = moneyLog.split('\n');
                if (moneyLog[0].indexOf('+') !== -1) {
                    data.paymentAmount = Number(moneyLog[0].replace(/[^\d\+]/g, ''));
                    data.botBalance = Number(moneyLog[1].replace(/[^\d\+]/g, ''));
                    const rrId = await (await payments[i].$('.results_date.dot.hov2'))
                        .evaluate((el) => el.getAttribute('action'));

                    data.rrId = rrId.replace(/[^\d\+]/g, '');

                    data.date = await (await payments[i].$('.log_dates')).evaluate((el) => el.innerText);

                    parsedPayments.push(data);
                } else {
                    continue;
                }
            }
            parsedPayments = parsedPayments.reverse();
            if (!parsedPayments.length) return;

            const lastPayment = await paymentsRedisModule.getLastPayment();

            let newMessages = [];

            const index = paymentsHelper.getLastPaymentIndex(lastPayment, parsedPayments);

            if (index === -1) {
                await paymentsRedisModule.setLastPayment(parsedPayments[parsedPayments.length - 1]);
                if (parsedPayments.length > 1) return;
            }
            newMessages = parsedPayments.slice(index + 1);

            const l = newMessages.length - 1;
            for (let i = 0; i < newMessages.length; i += 1) {
                financeService.deposit({
                    amount: newMessages[i].paymentAmount,
                    rrId: newMessages[i].rrId,
                });
                console.log('newMessages => ', newMessages[i]);
                if (i === l) {
                    await paymentsRedisModule.setLastPayment(newMessages[i]);
                }
            }
        } catch (e) {
            console.error('paymentsChecker err => ', e);
        } finally {
            await paymentsRedisModule.unlockRoom();
        }
    },

    async withdrawal({ rrId, amount }) {
        const pg = await BROWSER.newPage();
        try {
            console.log(amount);

            await pg.goto(CONFIGS.URLS.DONATE + rrId);

            await pg.waitForSelector('.donate_w.float_left.white.imp.storage_item.pointer.hov.border_donate');

            const els = await pg.$$('.donate_w.float_left.white.imp.storage_item.pointer.hov.border_donate');

            await pg.waitForTimeout(100);

            await els[els.length - 1].click();

            await pg.waitForTimeout(100);

            await pg.focus('.imp.donate_amount.storage_sell_ammount.tc.white.tpbg');

            await pg.keyboard.down('ControlLeft');

            await pg.keyboard.press('a');

            await pg.keyboard.up('ControlLeft');

            await pg.keyboard.press('Backspace');
            await pg.waitForSelector('.donate_sell_button.button_green');

            await pg.keyboard.sendCharacter(String(amount));

            await (await pg.$('.donate_sell_button.button_green')).click();

            await pg.waitForTimeout(2000);
        } catch (e) {
            console.error('withdrawal err => ', e);
        } finally {
            await pg.close();
        }
    },
};
