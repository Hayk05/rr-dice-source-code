import frontHelper from '../app/helpers/frontHelper';

/* eslint-disable max-len */
export default {
    en: {
        balance: (balance) => `Your balance is ${balance}`,

        createRoomSuccess: ({ name, bet, roomId }) => `${name}, the game was successfully created with a bet of ${bet} 
        to join: /j ${roomId} || /join ${roomId}`,

        draw: (roomData, gameData) => {
            let text = `${roomData.ownerName}: \n ${CONFIGS.DICE_IMG_URL[gameData.dices[0]]} \n\n`;
            text += `${roomData.opponentName}: \n ${CONFIGS.DICE_IMG_URL[gameData.dices[1]]} \n`;
            text += 'Draw. Money refunded';
            return text;
        },

        withdrawal: (amount) => `Withdrawal success ${amount}!\n\nIf the money has not been credited to the account, please contact the support service. Telegram: @X777AM123`,
        deposit: (amount) => `Deposit success ${amount}!`,

        gameOver: (roomData, gameData, wonAmount) => {
            let text = `${roomData.ownerName}: \n ${CONFIGS.DICE_IMG_URL[gameData.dices[0]]} \n\n`;
            text += `${roomData.opponentName}: \n ${CONFIGS.DICE_IMG_URL[gameData.dices[1]]} \n`;
            let winnerName;
            if (roomData.ownerId === gameData.winnerId) {
                winnerName = roomData.ownerName;
            } else {
                winnerName = roomData.opponentName;
            }
            text += `Won: ${winnerName} || Won amount: ${wonAmount}`;
            return text;
        },

        deleteRoom: (roomData) => `${roomData.ownerName} Room ${roomData.id} deleted`,

        startInst: () => `Instructions for playing dice 

        First you need to replenish your balance by sending money to this account  - money can be withdrawn at any time by writing /withdrawal (/w) in personal messages of this account .
                
        Now you can enter the conference and play by following the instructions inside the conference. After each game, depending on its outcome, the money goes to the player's balance or is written off. As soon as you play enough, you can withdraw money from your balance to your RR account at any time. `,

        startInst2: () => `Please note that the winning amount of each is 5%!
        If you have any problems or questions, please contact support - Telegram: @X777AM123
        
        Do not keep your money in the bot's account for a long time. We are not responsible for the money in case the bot account is banned.

        RU CONFERENCE: https://rivalregions.com/#slide/join/543254/0b37d5eb49c0c78885a93e1e26d920a2

        To change language: /en , /ru`,

        changeLangSucc: () => 'Language changed to english',

        verbalWarning: (name) => `${name}, This conference is for the command. Please do not write anything here except command. If you want to know more information, "/start" || "/help"`,

        givenWarn: (name, reason) => `${name}, You have been given a warning. \nReason: ${reason}`,

        ss: () => 'Something went wrong',
        ssc: (name) => `${name}, Something went wrong`,

        balancErr: () => 'You don\'t have enough funds',

        balancErrConff: (name) => `${name} You don't have enough funds`,

        minBetErr: (name) => `${name}, Minimum bet: ${frontHelper.moneyRawFormater(CONFIGS.MIN_BET)}`,

        roomStErr: (name) => `${name}, Game started`,

        haveRoomErr: (name) => `${name}, You have already created a room`,

        ddComands: () => 'The bot sometimes does not read commands. In this case, duplicate the message.',

        noRooms: () => 'No active rooms',

        help: () => `
        Commands that can be written in private messages to the bot
        
        /help - Info

        /start - Get instructions and a link to join the room.

        Language:
        /en - English
        /ru - Русский

        Options:
        /balance - Find out how much money is on the balance
        /withdrawal (/w) - Withdrawal of the specified amount. 
        Example: /w 1kkkk

        Commands that can be written to the conference

        /help - Info

        /start - Get instructions and a link to join the room.

        Game: 
        /dice (/d) - Create a room of the specified amount
        Example: /d 1t
        /join (/j) - Enter the specified room and start the game
        Example: /j 127
        /del - Delete the specified room
        Example: /del 127
        /rooms (/r) - Get a list of all rooms
        `,
    },

    ru: {
        balance: (balance) => `Ваш баланс ${balance}`,

        createRoomSuccess: ({ name, bet, roomId }) => `${name}, Вы успешно создали комнату со ставкой ${bet} 
        Чтобы зайти: /j ${roomId} || /join ${roomId}`,

        draw: (roomData, gameData) => {
            let text = `${roomData.ownerName}: \n ${CONFIGS.DICE_IMG_URL[gameData.dices[0]]} \n\n`;
            text += `${roomData.opponentName}: \n ${CONFIGS.DICE_IMG_URL[gameData.dices[1]]} \n`;
            text += 'Ничья. Деньги были возвращены';
            return text;
        },

        withdrawal: (amount) => `Успешный вывод средств ${amount}!\n\nЕсли деньги на счёт аккаунта не поступили, обращайтесь в службу поддержки. Telegram: @X777AM123`,
        deposit: (amount) => `Успешный депозита ${amount}!`,

        gameOver: (roomData, gameData, wonAmount) => {
            let text = `${roomData.ownerName}: \n ${CONFIGS.DICE_IMG_URL[gameData.dices[0]]} \n\n`;
            text += `${roomData.opponentName}: \n ${CONFIGS.DICE_IMG_URL[gameData.dices[1]]} \n`;
            let winnerName;
            if (roomData.ownerId === gameData.winnerId) {
                winnerName = roomData.ownerName;
            } else {
                winnerName = roomData.opponentName;
            }
            text += `Выиграл: ${winnerName} || Сумма выигрыша: ${wonAmount}`;
            return text;
        },

        deleteRoom: (roomData) => `${roomData.ownerName} Комната  ${roomData.id} была удалена`,

        startInst: () => `Инструкция по игре в «кости»
        
        Для начала нужно пополнить свой баланс, отправив деньги на этот аккаунт РР - деньги можно вывести в любой момент, написав в личных сообщениях этого аккаунта /withdrawal (/w)
        
        Теперь можно зайти в конференцию по ссылке и играть, следуя инструкциям внутри конференции. После каждой игры, в зависимости от её исхода, деньги поступают на баланс игрока или списываются. Как только наиграетесь - можете в любой момент вывести деньги с баланса на счёт аккаунта РР.`,

        startInst2: () => `Обратите внимание, что комиссия с каждого выигрыша составляет 5%! 
        При возникновении проблем или вопросов, обращайтесь в тех.поддержку - Telegram: @X777AM123
        
        Не держите на протяжении длительного срока свои деньги на счету бота. Мы не несём ответственности за деньги в случае бана аккаунта бота.
        
        RU CONFERENCE: https://rivalregions.com/#slide/join/543254/0b37d5eb49c0c78885a93e1e26d920a2 
            To change language: /en /ru`,

        changeLangSucc: () => 'Язык изменен на русский',

        verbalWarning: (name) => `${name}, Эта конференция предназначена для комманд. Пожалуйста, не пишите здесь ничего, кроме команд. Если вы хотите узнать больше информации, "/start" || "/help"`,

        givenWarn: (name, reason) => `${name}, Вы получили предупреждение. \n Причина: ${reason}`,

        ss: () => 'Что-то пошло не так',
        ssc: (name) => `${name}, Что-то пошло не так`,

        balancErr: () => 'У вас недостаточно средств',

        balancErrConff: (name) => `${name}, У Вас недостаточно средств`,

        minBetErr: (name) => `${name}, Минимальная ставка: ${frontHelper.moneyRawFormater(CONFIGS.MIN_BET)}`,

        roomStErr: (name) => `${name}, Игра уже началась`,

        haveRoomErr: (name) => `${name}, У Вас уже создана комната`,

        noRooms: () => 'Нет активных комнат',

        ddComands: () => 'Бот иногда не читает команды. В таком случае дублируйте сообщение.',

        help: () => `
        Команды, которые могут быть использованы в личных сообщениях бота:

        /help - Информация
        
        /start - Получить инструкцию и ссылку на вступление в комнату.
        
        Язык:
        /en - English
        /ru - Русский
        
        Опции:
        /balance - узнать сколько денег на балансе.
        /withdrawal (/w) - вывести указанную сумму денег.
        Пример: /w 1kkkk
        
        
        Команды, которые могут быть использованы в игровой конференции:
        
        /help - Информация
        
        /start - Получить инструкцию и ссылку на вступление в комнату.
        
        Игра:
        /dice (/d) - Создать «комнату» на указанную сумму.
        Пример: /d 1t
        /join (/j) - Присоединиться к указанной комнате и начать игру.
        Пример: /j 127 
        /del - Удалить указанную комнату.
        Пример: /del 127
        /rooms (/r) - Получить список всех активных комнат
        `,
    },
};
