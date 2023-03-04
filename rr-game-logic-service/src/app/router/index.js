import gameLogicRouter from './gameLogicRouter';

export default {
    init() {
        try {
            gameLogicRouter.init();
        } catch (e) {
            console.error('router init err => ', e);
        }
    },
};
