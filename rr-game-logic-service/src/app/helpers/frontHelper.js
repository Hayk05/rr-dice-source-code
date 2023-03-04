export default {
    moneyRawFormater(balance) {
        const balanceRaw = String(balance).replace(/(.)(?=(\d{3})+$)/g, '$1,');
        return balanceRaw;
    },

    generateRoomFrontData(roomData) {
        return {
            id: roomData.id,
            bet: roomData.bet,
            ownerName: roomData.ownerName,
            ttl: roomData.ttl,
            lang: roomData.lang,
        };
    },
};
