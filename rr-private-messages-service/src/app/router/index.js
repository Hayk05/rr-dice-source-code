import privateMessagesRouter from './privateMessagesRouter';

export default {
    init() {
        try {
            privateMessagesRouter.init();
        } catch (e) {
            console.error('router init err => ', e);
        }
    },
};
