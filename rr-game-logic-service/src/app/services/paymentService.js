/* eslint-disable max-len */
// eslint-disable-next-line import/no-extraneous-dependencies
import FormData from 'form-data';
import axios from 'axios';

export default {
    async withdrawal({ rrId, amount }) {
        const form = new FormData();

        form.append('whom', rrId);
        form.append('type', '0');
        form.append('n', amount);
        form.append('c', CONFIGS.BOT_HUYZNAET_TOKEN);

        const response = await axios.request({
            method: 'POST',
            url: 'https://rivalregions.com/storage/donate/',
            data: form,

            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
                referer: 'https://rivalregions.com/',
                origin: 'https://rivalregions.com/',
                path: '/storage/donate',
                Cookie: CONFIGS.BOT_AUTHORIZATION_COOKES,
            },
        });

        return response.status === 200 && response.data === '';
    },
};
