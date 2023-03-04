import conferenceRouter from './conferenceRouter';

export default {
    init() {
        try {
            conferenceRouter.init();
        } catch (e) {
            console.error('router init err => ', e);
        }
    },
};
