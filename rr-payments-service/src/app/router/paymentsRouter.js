import paymentsController from '../controllers/paymentsController';
import notificationService from '../services/notificationService';

export default {
    init() {
        this.setupListeners();
    },

    setupListeners() {
        notificationService.on(CONFIGS.NOTIFICATIONS.PAYMENTS_CHECKER, this.paymentsChecker.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.WITHDRAWAL, this.withdrawal.bind(this));
    },

    async paymentsChecker() {
        try {
            await paymentsController.paymentsChecker();
        } catch (e) {
            console.error('paymentsChecker err => ', e);
        }
    },

    async withdrawal(message) {
        try {
            await paymentsController.withdrawal(message);
        } catch (e) {
            console.error('withdrawal err => ', e);
        }
    },
};
