import amqp from 'amqplib/callback_api';
import notificationService from './notificationService';

export default {

    async init() {
        await this.connect();
        this.channel = await this.makeChannel();
        this.subscribe(`${CONFIGS.RABBITMQ_PREFIX}.*`);
        this.notificationHendler();
    },

    connect() {
        return new Promise((resolve, reject) => {
            amqp.connect(
                // eslint-disable-next-line max-len
                `amqp://${CONFIGS.RABBITMQ_USER}:${CONFIGS.RABBITMQ_PASSWORD}@${CONFIGS.RABBITMQ_HOST}:${CONFIGS.RABBITMQ_PORT}`,
                (error0, connection) => {
                    if (error0) {
                        reject(error0);
                    }
                    global.RABBIT = connection;
                    resolve({ error: false });
                },
            );
        });
    },

    makeChannel() {
        return new Promise((resolve, reject) => {
            RABBIT.createChannel((error, channel) => {
                if (error) {
                    reject(error);
                }
                channel.assertExchange(CONFIGS.RABBITMQ_EXCHANGE, 'topic', { durable: false });
                channel.assertQueue(
                    CONFIGS.RABBITMQ_QUEUE,
                    {
                        durable: true,
                    },
                    (error1, q) => {
                        if (error) {
                            reject(error1);
                        }
                        this.q = q;
                        resolve(channel);
                    },
                );
            });
        });
    },

    subscribe(event) {
        this.channel.bindQueue(this.q.queue, CONFIGS.RABBITMQ_EXCHANGE, event);
    },

    unsubscribe(event) {
        this.channel.unbindQueue(this.q.queue, CONFIGS.RABBITMQ_EXCHANGE, event);
    },

    publish(exchangeName, event, message) {
        return new Promise((resolve) => {
            this.channel.publish(exchangeName, event, Buffer.from(message));
            resolve({ error: false });
        });
    },

    notificationHendler() {
        this.channel.consume(this.q.queue, (msg) => {
            try {
                switch (msg.fields.routingKey) {
                case `${CONFIGS.RABBITMQ_PREFIX}.deposit`:
                    notificationService.sendNotification(
                        `${CONFIGS.RABBITMQ_PREFIX}.deposit`,
                        JSON.parse(msg.content.toString()),
                    );
                    break;
                case `${CONFIGS.RABBITMQ_PREFIX}.withdrawal`:
                    notificationService.sendNotification(
                        `${CONFIGS.RABBITMQ_PREFIX}.withdrawal`,
                        JSON.parse(msg.content.toString()),
                    );
                    break;
                case `${CONFIGS.RABBITMQ_PREFIX}.getBalance`:
                    notificationService.sendNotification(
                        `${CONFIGS.RABBITMQ_PREFIX}.getBalance`,
                        JSON.parse(msg.content.toString()),
                    );
                    break;
                case `${CONFIGS.RABBITMQ_PREFIX}.createRoom`:
                    notificationService.sendNotification(
                        `${CONFIGS.RABBITMQ_PREFIX}.createRoom`,
                        JSON.parse(msg.content.toString()),
                    );
                    break;
                case `${CONFIGS.RABBITMQ_PREFIX}.joinRoom`:
                    notificationService.sendNotification(
                        `${CONFIGS.RABBITMQ_PREFIX}.joinRoom`,
                        JSON.parse(msg.content.toString()),
                    );
                    break;
                case `${CONFIGS.RABBITMQ_PREFIX}.deleteRoom`:
                    notificationService.sendNotification(
                        `${CONFIGS.RABBITMQ_PREFIX}.deleteRoom`,
                        JSON.parse(msg.content.toString()),
                    );
                    break;
                case `${CONFIGS.RABBITMQ_PREFIX}.getStartInstruction`:
                    notificationService.sendNotification(
                        `${CONFIGS.RABBITMQ_PREFIX}.getStartInstruction`,
                        JSON.parse(msg.content.toString()),
                    );
                    break;
                case `${CONFIGS.RABBITMQ_PREFIX}.changeLanguage`:
                    notificationService.sendNotification(
                        `${CONFIGS.RABBITMQ_PREFIX}.changeLanguage`,
                        JSON.parse(msg.content.toString()),
                    );
                    break;
                case `${CONFIGS.RABBITMQ_PREFIX}.unknownConferenceMessageHandling`:
                    notificationService.sendNotification(
                        `${CONFIGS.RABBITMQ_PREFIX}.unknownConferenceMessageHandling`,
                        JSON.parse(msg.content.toString()),
                    );
                    break;
                case `${CONFIGS.RABBITMQ_PREFIX}.getRoomList`:
                    notificationService.sendNotification(
                        `${CONFIGS.RABBITMQ_PREFIX}.getRoomList`,
                        JSON.parse(msg.content.toString()),
                    );
                    break;
                case `${CONFIGS.RABBITMQ_PREFIX}.help`:
                    notificationService.sendNotification(
                        `${CONFIGS.RABBITMQ_PREFIX}.help`,
                        JSON.parse(msg.content.toString()),
                    );
                    break;
                default: {
                    console.error('RABBIT undefined event => ', msg.fields.routingKey);
                }
                }
            } catch (e) {
                console.error('RABBIT event failed => ', e);
            }
        }, {
            noAck: true,
        });
    },
};
