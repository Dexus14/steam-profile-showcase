import { getLevel, getPlayerSummary, getRecentlyPlayed } from './steamApiService';
import { generateCacheKey, getRegularTemaplateData, renderDefaultImage } from './renderUtilsService';
import NodeCache from 'node-cache';
import { RegularTemplateOptions } from '../interfaces/renderInterfaces';

const imageCache = new NodeCache({
    stdTTL: 240,
    checkperiod: 240,
});

export async function generateRegularTemplate(steamid: string, options: RegularTemplateOptions) {
    const cacheKey = generateCacheKey(steamid, 'regular', options);

    if (imageCache.has(cacheKey)) {
        return imageCache.get(cacheKey);
    }

    const [playerSummary, recentlyPlayedGames, playerLevelData] = await Promise.all([
        getPlayerSummary(steamid),
        getRecentlyPlayed(steamid),
        getLevel(steamid),
    ]);

    try {
        const imageData = getRegularTemaplateData(
            recentlyPlayedGames.data.response.games,
            playerSummary.data.response.players[0],
            playerLevelData.data.response.player_level,
            options,
        );

        const image = await renderDefaultImage(imageData);

        imageCache.set(cacheKey, image);

        return image;
    } catch (e) {
        throw e;
    }
}
