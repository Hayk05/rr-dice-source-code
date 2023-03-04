import router from './router';
import services from './services';
import models from './models';
import browser from './browser';

const app = {
    async init() {
        router.init();
        await models.init();
        await services.init();
        await browser.init();
    },
};

app.init().then(() => {
    console.log('app started...');
});
