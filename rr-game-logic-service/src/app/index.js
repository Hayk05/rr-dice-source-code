import router from './router';
import services from './services';
import models from './models';

const app = {
    async init() {
        router.init();
        await models.init();
        await services.init();
    },
};

app.init().then(() => {
    console.log('app started...');
});
