import roomRedisModule from '../models/redis/roomRedisModule';
import notificationService from './notificationService';

export default {
    init() {
        this.handlingPlayersWarning();
        this.updateTimers();
        this.rakeTransfer();
    },

    handlingPlayersWarning() {
        notificationService.sendNotification(CONFIGS.NOTIFICATIONS.HANDLING_PLAYERS_WARNING);
        setTimeout(this.handlingPlayersWarning.bind(this), 1000 * 60 * 60);
    },

    rakeTransfer() {
        notificationService.sendNotification(CONFIGS.NOTIFICATIONS.RAKE_TRANSFER, {
            rrId: CONFIGS.RAKE_TRANSFER_ACCOUNT_ID,
        });
        setTimeout(this.rakeTransfer.bind(this), 1000 * 60 * 60);
    },

    async updateTimers() {
        try {
            let switcher = true;
            while (switcher) {
                const response = await roomRedisModule.getZTimer();
                if (response.length) {
                    if (new Date().getTime() >= Number(response[1])) {
                        notificationService.sendNotification(
                            CONFIGS.NOTIFICATIONS.TIMER_TRIGGER,
                            {
                                roomId: response[0],
                            },
                        );
                    } else {
                        await roomRedisModule.addZTimer(response[0], response[1]);
                        switcher = false;
                    }
                } else {
                    switcher = false;
                }
            }

            setTimeout(this.updateTimers.bind(this), 1000);
        } catch (e) {
            console.error('Update timers failed => ', e);
        }
    },

    async addTimer(roomId, date) {
        await roomRedisModule.addZTimer(roomId, date.getTime());
    },

    async removeTimer(roomId) {
        await roomRedisModule.delZTimer(roomId);
    },
};
