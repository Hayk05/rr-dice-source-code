import rabbitService from './rabbitService';

export default {
    deposit(data) {
        rabbitService.publish(CONFIGS.RABBITMQ_EXCHANGE, 'gameLogic.deposit', JSON.stringify(data));
    },
};
