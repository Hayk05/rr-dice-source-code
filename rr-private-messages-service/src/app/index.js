import router from './router';
import services from './services';
import browser from './browser';
import models from './models';

const app = {
    async init() {
        router.init();
        await models.init();
        await browser.init();
        await services.init();
    },
};

app.init().then(() => {
    console.log('app started...');
});
