export default {
    createTransactionData(playerData, amount, kind, meta) {
        return {
            ref_id: playerData.id,
            ref_rr_id: playerData.rrId,
            amount,
            kind,
            meta,
        };
    },
};
