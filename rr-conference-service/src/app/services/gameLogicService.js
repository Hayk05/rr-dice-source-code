import rabbitService from './rabbitService';

export default {
    createRoom(data) {
        rabbitService.publish(
            CONFIGS.RABBITMQ_EXCHANGE, 'gameLogic.createRoom', JSON.stringify(data),
        );
    },

    joinRoom(data) {
        rabbitService.publish(
            CONFIGS.RABBITMQ_EXCHANGE, 'gameLogic.joinRoom', JSON.stringify(data),
        );
    },

    deleteRoom(data) {
        rabbitService.publish(
            CONFIGS.RABBITMQ_EXCHANGE, 'gameLogic.deleteRoom', JSON.stringify(data),
        );
    },

    unknownConferenceMessageHandling(data) {
        rabbitService.publish(
            CONFIGS.RABBITMQ_EXCHANGE, 'gameLogic.unknownConferenceMessageHandling', JSON.stringify(data),
        );
    },

    getStartInstruction(data) {
        rabbitService.publish(
            CONFIGS.RABBITMQ_EXCHANGE, 'gameLogic.getStartInstruction', JSON.stringify(data),
        );
    },

    help(data) {
        rabbitService.publish(
            CONFIGS.RABBITMQ_EXCHANGE, 'gameLogic.help', JSON.stringify(data),
        );
    },

    getRoomList(data) {
        rabbitService.publish(
            CONFIGS.RABBITMQ_EXCHANGE, 'gameLogic.getRoomList', JSON.stringify(data),
        );
    },
};
