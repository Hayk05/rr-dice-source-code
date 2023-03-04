export default {
    messages: {
        400: 'Bed Data',
    },

    hendl(code) {
        return { error: true, message: this.messages[code] };
    },
};
