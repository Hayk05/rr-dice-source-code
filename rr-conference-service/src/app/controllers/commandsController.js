import commandHelper from '../helpers/commandHelper';
import gameLogicService from '../services/gameLogicService';
import notificationService from '../services/notificationService';

export default {
    hendler({
        rrId, name, date, text,
    }) {
        if (rrId === CONFIGS.BOT_PROFILE_ID) return;

        if (commandHelper.isSystemCommand(text)) {
            console.log('system command');
            return;
        }

        const command = text.split(' ');
        switch (command[0]) {
        case '/help': {
            gameLogicService.help({ rrId });
            break;
        }
        case '/start': {
            gameLogicService.getStartInstruction({ rrId });
            break;
        }
        case '/d':
        case '/dice': {
            gameLogicService.createRoom({
                rrId,
                bet: command[1],
                name,
                lang: CONFIGS.CONFERENCE_LANG,
            });
            break;
        }
        case '/del': {
            gameLogicService.deleteRoom({
                roomId: command[1],
                rrId,
                name,
            });
            break;
        }
        case '/join':
        case '/j': {
            gameLogicService.joinRoom({
                rrId,
                roomId: command[1],
                name,
                lang: CONFIGS.CONFERENCE_LANG,
            });
            break;
        }
        case '/rooms':
        case '/r': {
            gameLogicService.getRoomList({
                lang: CONFIGS.CONFERENCE_LANG,
            });
            break;
        }
        default: {
            if (command[0].search('/') !== -1) {
                notificationService.sendNotification(
                    CONFIGS.NOTIFICATIONS.SEND_MESSAGE,
                    {
                        message: `${name}, Unknown command. Use "/help"`,
                    },
                );
            } else if (CONFIGS.AUTHOMODERATION) {
                gameLogicService.unknownConferenceMessageHandling({ rrId, lang: CONFIGS.CONFERENCE_LANG, name });
            }
        }
        }
    },
};
