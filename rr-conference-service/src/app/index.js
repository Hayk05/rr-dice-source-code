import browser from './browser';
import models from './models';
import router from './router';
import services from './services';

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
    console.log('page id =>', CONFIGS.PAGE_ID);
});
