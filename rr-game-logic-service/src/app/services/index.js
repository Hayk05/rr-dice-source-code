import rabbitService from './rabbitService';
import timerService from './timerService';

export default {
    async init() {
        try {
            await rabbitService.init();
            timerService.init();
        } catch (e) {
            console.error('service init setup err => ', e);
            process.exit(1);
        }
    },
};
