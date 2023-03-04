export default {
    getLastMessageIndex(lastMessage, parsedMessages) {
        return parsedMessages.findIndex((m) => m.rrId === lastMessage.rrId && m.name === lastMessage.name
        && m.date === lastMessage.date && m.text === lastMessage.text);
    },
};
