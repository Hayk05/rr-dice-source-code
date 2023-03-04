import notificationService from './notificationService';

export default {
    init() {
        setTimeout(this.paymentsChecker.bind(this), 1000 * 5);
    },

    paymentsChecker() {
        notificationService.sendNotification(CONFIGS.NOTIFICATIONS.PAYMENTS_CHECKER);
        setTimeout(this.paymentsChecker.bind(this), 1000 * 5);
    },
};
