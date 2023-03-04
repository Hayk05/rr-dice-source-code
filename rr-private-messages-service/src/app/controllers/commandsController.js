import gameLogicService from '../services/gameLogicService';
import notificationService from '../services/notificationService';

export default {
    hendler({ text, rrId }) {
        const command = text.split(' ');
        switch (command[0]) {
        case '/start': {
            gameLogicService.getStartInstruction({ rrId });
            break;
        }
        case '/en': {
            gameLogicService.changeLanguage({
                rrId,
                lang: 'en',
            });
            break;
        }
        case '/ru': {
            gameLogicService.changeLanguage({
                rrId,
                lang: 'ru',
            });
            break;
        }
        case '/balance': {
            gameLogicService.getBalance({ rrId });
            break;
        }
        case '/w':
        case '/withdrawal': {
            gameLogicService.withdrawal({ rrId, amount: command[1] });
            break;
        }
        case '/help': {
            gameLogicService.help({ rrId });
            break;
        }
        default: {
            notificationService.sendNotification(
                CONFIGS.NOTIFICATIONS.SEND_MESSAGE,
                {
                    rrId,
                    message: 'Unknown command. Use "/help"',
                },
            );
        }
        }
    },
};
