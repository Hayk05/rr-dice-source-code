import notificationService from './notificationService';

export default {
    init() {
        this.updateConferencePage();
        setTimeout(this.messagesParser.bind(this), 1000 * 2);
    },

    updateConferencePage() {
        notificationService.sendNotification(CONFIGS.NOTIFICATIONS.UPDATE_CONFERENCE_PAGE);
        setTimeout(this.updateConferencePage.bind(this), 1000 * 60);
    },

    messagesParser() {
        notificationService.sendNotification(CONFIGS.NOTIFICATIONS.PARS_MESSAGES);
        setTimeout(this.messagesParser.bind(this), 1000 * 3);
    },
};
