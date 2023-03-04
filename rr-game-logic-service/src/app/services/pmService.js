import rabbitService from './rabbitService';

export default {
    sendMessage(data) {
        rabbitService.publish(
            CONFIGS.RABBITMQ_EXCHANGE, 'privateMessages.sendPMMessage', JSON.stringify(data),
        );
    },
};
