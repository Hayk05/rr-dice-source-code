export default {
    isSystemCommand(text) {
        if (text === 'Участник покинул конференцию.') return true;
        if (text === 'Возможность писать отключена для всей конференции, кроме главы и помощников.') return true;
        if (text === 'Возможность писать включена.') return true;
        if (text.search('Новый участник:') !== -1) return true;
        if (text.search('Участник исключен:') !== -1) return true;
        if (text.search('Участник исключен:') !== -1) return true;
        if (text.search('Возможность писать отключена:') !== -1) return true;
        if (text.search('Возможность писать включена:') !== -1) return true;
        return false;
    },
};
