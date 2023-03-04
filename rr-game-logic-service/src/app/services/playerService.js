import playerHelper from '../helpers/playerHelper';
import playerPostgreModule from '../models/postgre/playerPostgreModule';
import playerRedisModule from '../models/redis/playerRedisModule';

export default {
    async getPlayer(rrId) {
        try {
            const playerData = await playerRedisModule.getPlayer(rrId);

            if (playerData.id) {
                return playerData;
            }

            const playerPostgreData = await playerPostgreModule.getPlayerByRR(rrId);

            if (playerPostgreData.error) {
                return {
                    error: true,
                    playerPostgreData,
                };
            }

            if (playerPostgreData.id) {
                const redisData = playerHelper.makePlayerPgDataToRedis(playerPostgreData);
                await playerRedisModule.updatePlayer(redisData);
                return redisData;
            }

            const playerInsertData = await playerPostgreModule.insertPlayer(rrId);

            if (playerInsertData.error) {
                return {
                    error: true,
                    playerInsertData,
                };
            }

            const redisData = playerHelper.makePlayerPgDataToRedis(
                {
                    id: playerInsertData.id,
                    rr_id: rrId,
                    balance: 0,
                    lang: 'en',
                },
            );
            await playerRedisModule.updatePlayer(redisData);

            return redisData;
        } catch (e) {
            console.error('getPlayer err => ', e);
            return {
                error: true,
                e,
            };
        }
    },
};
