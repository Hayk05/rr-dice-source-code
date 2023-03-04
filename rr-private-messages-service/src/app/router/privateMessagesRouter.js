import commandsController from '../controllers/commandsController';
import privateMessagesController from '../controllers/privateMessagesController';
import notificationService from '../services/notificationService';

export default {
    init() {
        this.setupListeners();
    },

    setupListeners() {
        notificationService.on(CONFIGS.NOTIFICATIONS.PM_HENDLER, this.pmHandler.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.COMMAND_HENDLER, this.commandHendler.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.SEND_MESSAGE, this.sendPMMessage.bind(this));
    },

    async pmHandler(message) {
        try {
            await privateMessagesController.pmHandler(message);
        } catch (e) {
            console.error('pmHandler err => ', e);
        }
    },

    async commandHendler(message) {
        try {
            await commandsController.hendler(message);
        } catch (e) {
            console.error('commandHendler err => ', e);
        }
    },

    async sendPMMessage(message) {
        try {
            await privateMessagesController.sendPMMessage(message);
        } catch (e) {
            console.error('sendPMMessage err => ', e);
        }
    },
};
