export default {
    makePlayerPgDataToRedis(pgData) {
        return {
            id: Number(pgData.id),
            rrId: pgData.rr_id,
            balance: Number(pgData.balance),
            lang: pgData.lang,
            unknownConferenceMessageTriggerCount: 0,
            roomId: null,
        };
    },
};
