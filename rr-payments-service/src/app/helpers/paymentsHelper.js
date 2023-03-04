export default {
    getLastPaymentIndex(lastPayment, parsedPayments) {
        return parsedPayments.findIndex((m) => m.rrId === lastPayment.rrId && m.botBalance === lastPayment.botBalance
        && m.date === lastPayment.date && m.paymentAmount === lastPayment.paymentAmount);
    },
};
