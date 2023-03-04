import rabbitService from './rabbitService';

export default {
    getBalance(data) {
        rabbitService.publish(
            CONFIGS.RABBITMQ_EXCHANGE, 'gameLogic.getBalance', JSON.stringify(data),
        );
    },

    withdrawal(data) {
        rabbitService.publish(
            CONFIGS.RABBITMQ_EXCHANGE, 'gameLogic.withdrawal', JSON.stringify(data),
        );
    },

    getStartInstruction(data) {
        rabbitService.publish(
            CONFIGS.RABBITMQ_EXCHANGE, 'gameLogic.getStartInstruction', JSON.stringify(data),
        );
    },

    changeLanguage(data) {
        rabbitService.publish(
            CONFIGS.RABBITMQ_EXCHANGE, 'gameLogic.changeLanguage', JSON.stringify(data),
        );
    },

    help(data) {
        rabbitService.publish(
            CONFIGS.RABBITMQ_EXCHANGE, 'gameLogic.help', JSON.stringify(data),
        );
    },
};
