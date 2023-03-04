import paymentsRouter from './paymentsRouter';

export default {
    init() {
        try {
            paymentsRouter.init();
        } catch (e) {
            console.error('router init err => ', e);
        }
    },
};
