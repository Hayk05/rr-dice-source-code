import commandsController from '../controllers/commandsController';
import conferenceController from '../controllers/conferenceController';
import notificationService from '../services/notificationService';

export default {
    init() {
        this.setupListeners();
    },

    setupListeners() {
        notificationService.on(CONFIGS.NOTIFICATIONS.PARS_MESSAGES, this.messagesParser.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.UPDATE_CONFERENCE_PAGE, this.updateConferencePage.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.COMMAND_HENDLER, this.commandHendler.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.SEND_MESSAGE, this.sendMessage.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.MUTE_REQUEST, this.mute.bind(this));
    },

    async messagesParser() {
        try {
            await conferenceController.messagesParser();
        } catch (e) {
            console.error('messagesParser err => ', e);
        }
    },

    async updateConferencePage() {
        try {
            await conferenceController.updateConferencePage();
        } catch (e) {
            console.error('updateConferencePage err => ', e);
        }
    },

    async commandHendler(messages) {
        try {
            await commandsController.hendler(messages);
        } catch (e) {
            console.error('commandHendler err => ', e);
        }
    },

    async sendMessage(messages) {
        try {
            await conferenceController.sendMessage(messages);
        } catch (e) {
            console.error('sendMessage err => ', e);
        }
    },

    async mute(messages) {
        try {
            await conferenceController.giveMute(messages);
        } catch (e) {
            console.error('giveMute err => ', e);
        }
    },
};
