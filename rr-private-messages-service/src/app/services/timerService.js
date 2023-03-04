import notificationService from './notificationService';

export default {
    init() {
        setTimeout(this.pmHendler.bind(this), 1000 * 3);
    },

    async pmHendler() {
        notificationService.sendNotification(
            CONFIGS.NOTIFICATIONS.PM_HENDLER,
        );
        setTimeout(this.pmHendler.bind(this), 1000 * 3);
    },
};
