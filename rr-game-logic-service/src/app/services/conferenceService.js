import rabbitService from './rabbitService';

export default {
    sendMessage(lang, data) {
        rabbitService.publish(
            CONFIGS.RABBITMQ_EXCHANGE, `conference.${lang}.sendMessage`, JSON.stringify(data),
        );
    },

    mute(lang, data) {
        rabbitService.publish(
            CONFIGS.RABBITMQ_EXCHANGE, `conference.${lang}.mute`, JSON.stringify(data),
        );
    },
};

