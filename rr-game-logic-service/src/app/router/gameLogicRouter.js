import financeController from '../controllers/financeController';
import gameLogicController from '../controllers/gameLogicController';
import processingController from '../controllers/processingController';
import notificationService from '../services/notificationService';
import moderationController from '../controllers/moderationController';

export default {
    init() {
        this.setupListeners();
    },

    setupListeners() {
        notificationService.on(CONFIGS.NOTIFICATIONS.DEPOSIT, this.deposit.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.WITHDRAWAL, this.withdrawal.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.GET_BALANCE, this.getBalance.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.CREATE_ROOM, this.createRoom.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.JOIN_ROOM, this.joinRoom.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.GAME, this.game.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.GAME_OVER, this.gameOver.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.WIN, this.win.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.REFUND, this.refund.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.DELETE_PLAYER_ROOM_ID, this.deletePlayerRoomId.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.DELETE_ROOM, this.deleteRoom.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.GET_START_INSTRUCTION, this.getStartInstruction.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.CHANGE_LANGUAGE, this.changeLanguage.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.UNKNOWN_CONFERENCE_MESSAGE_HANDLING,
            this.unknownConferenceMessageHandling.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.WARN, this.warn.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.HANDLING_PLAYERS_WARNING, this.handlingPlayersWarning.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.GET_ROOM_LIST, this.getRoomList.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.TIMER_TRIGGER, this.timerTrigger.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.HELP, this.help.bind(this));
        notificationService.on(CONFIGS.NOTIFICATIONS.RAKE_TRANSFER, this.rakeTransfer.bind(this));
    },

    async deposit(message) {
        try {
            await financeController.deposit(message);
        } catch (e) {
            console.error('deposit err => ', e);
        }
    },

    async withdrawal(message) {
        try {
            await financeController.withdrawal(message);
        } catch (e) {
            console.error('withdrawal err => ', e);
        }
    },

    async getBalance(message) {
        try {
            await financeController.getBalance(message);
        } catch (e) {
            console.error('getBalance err => ', e);
        }
    },

    async win(message) {
        try {
            await financeController.win(message);
        } catch (e) {
            console.error('win err => ', e);
        }
    },

    async refund(message) {
        try {
            await financeController.refund(message);
        } catch (e) {
            console.error('refund err => ', e);
        }
    },

    async createRoom(message) {
        try {
            await gameLogicController.createRoom(message);
        } catch (e) {
            console.error('createRoom err => ', e);
        }
    },

    async joinRoom(message) {
        try {
            await gameLogicController.joinRoom(message);
        } catch (e) {
            console.error('joinRoom err => ', e);
        }
    },

    async game(message) {
        try {
            await gameLogicController.game(message);
        } catch (e) {
            console.error('joinRoom err => ', e);
        }
    },

    async gameOver(message) {
        try {
            await gameLogicController.gameOver(message);
        } catch (e) {
            console.error('gameOver err => ', e);
        }
    },

    async deletePlayerRoomId(message) {
        try {
            await gameLogicController.deletePlayerRoomId(message);
        } catch (e) {
            console.error('deletePlayerRoomId err => ', e);
        }
    },

    async deleteRoom(message) {
        try {
            await gameLogicController.deleteRoom(message);
        } catch (e) {
            console.error('deleteRoom err => ', e);
        }
    },

    async getStartInstruction(message) {
        try {
            await processingController.getStartInstruction(message);
        } catch (e) {
            console.error('getStartInstruction err => ', e);
        }
    },

    async changeLanguage(message) {
        try {
            await processingController.changeLanguage(message);
        } catch (e) {
            console.error('changeLanguage err => ', e);
        }
    },

    async unknownConferenceMessageHandling(message) {
        try {
            await moderationController.unknownConferenceMessageHandling(message);
        } catch (e) {
            console.error('unknownConferenceMessageHandling err => ', e);
        }
    },

    async warn(message) {
        try {
            await moderationController.warn(message);
        } catch (e) {
            console.error('warn err => ', e);
        }
    },

    async handlingPlayersWarning(message) {
        try {
            await moderationController.handlingPlayersWarning(message);
        } catch (e) {
            console.error('handlingPlayersWarning err => ', e);
        }
    },

    async getRoomList(message) {
        try {
            await gameLogicController.getRoomList(message);
        } catch (e) {
            console.error('getRoomList err => ', e);
        }
    },

    async timerTrigger(message) {
        try {
            await gameLogicController.timerTrigger(message);
        } catch (e) {
            console.error('timerTrigger err => ', e);
        }
    },

    async help(message) {
        try {
            await processingController.help(message);
        } catch (e) {
            console.error('help err => ', e);
        }
    },

    async rakeTransfer(message) {
        try {
            await processingController.rakeTransfer(message);
        } catch (e) {
            console.error('rakeTransfer err => ', e);
        }
    },
};
