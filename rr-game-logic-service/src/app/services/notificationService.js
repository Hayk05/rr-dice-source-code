import EventEmitter from 'events';

class NotificationService extends EventEmitter {
    sendNotification(event, data) {
        this.emit(event, data);
    }
}

export default new NotificationService();
