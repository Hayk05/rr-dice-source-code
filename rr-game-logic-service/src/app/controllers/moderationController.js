import moment from 'moment/moment';
import notificationService from '../services/notificationService';
import warningsPostgreModule from '../models/postgre/warningsPostgreModule';
import playerRedisModule from '../models/redis/playerRedisModule';
import conferenceService from '../services/conferenceService';
import playerService from '../services/playerService';

export default {
    async unknownConferenceMessageHandling({ rrId, lang, name }) {
        try {
            if (!rrId || !lang || !name) return;

            await playerRedisModule.lockPlayer(rrId);

            const playerData = await playerService.getPlayer(rrId);

            playerData.unknownConferenceMessageTriggerCount += 1;

            if (playerData.unknownConferenceMessageTriggerCount === 1) {
                conferenceService.sendMessage(lang, {
                    message: CONFIGS.LOCALIZATION[lang].verbalWarning(name),
                });
            } else if (playerData.unknownConferenceMessageTriggerCount > 2) {
                notificationService.sendNotification(CONFIGS.NOTIFICATIONS.WARN, {
                    rrId: -1,
                    recipientId: rrId,
                    lang,
                    name,
                });
            }

            await playerRedisModule.updatePlayer(playerData);
        } catch (e) {
            console.error('unknownConferenceMessageHandling err => ', e);
        } finally {
            await playerRedisModule.unlockPlayer(rrId);
        }
    },

    async warn({
        rrId, recipientId, lang, name,
    }) {
        try {
            if (!rrId || !recipientId || !lang || !name) return;

            await playerRedisModule.lockPlayer(rrId);
            if (rrId === -1) {
                const reason = 'Auto mode flood';

                await warningsPostgreModule.giveWarn({
                    recipient_id: recipientId,
                    is_active: true,
                    reason,
                    ttl: moment(new Date()).add(1, 'd').toDate().getTime(),
                });

                conferenceService.sendMessage(lang, {
                    message: CONFIGS.LOCALIZATION[lang].givenWarn(name, reason),
                });
            }

            const playerWarnings = await warningsPostgreModule.getPlayerWarning(recipientId);

            if (playerWarnings.length >= 3) {
                await conferenceService.mute(lang, { recipientId });
            }
        } catch (e) {
            console.error('warn err => ', e);
        } finally {
            await playerRedisModule.unlockPlayer(rrId);
        }
    },

    async handlingPlayersWarning() {
        try {
            const activeWarnings = await warningsPostgreModule.getActiveWarnings();

            for (let i = 0; i < activeWarnings.length; i += 1) {
                if (Number(activeWarnings[i].ttl) > new Date().getTime()) {
                    await warningsPostgreModule.deactivateWarning(activeWarnings[i].recipient_id, {
                        is_active: false,
                    });
                }
            }
        } catch (e) {
            console.error('handlingPlayersWarning err => ', e);
        }
    },
};
