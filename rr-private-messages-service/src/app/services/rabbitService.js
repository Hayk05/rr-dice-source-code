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
                case `${CONFIGS.RABBITMQ_PREFIX}.sendPMMessage`:
                    notificationService.sendNotification(
                        `${CONFIGS.RABBITMQ_PREFIX}.sendPMMessage`,
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
