import { getLevel, getPlayerSummary, getRecentlyPlayed } from './steamApiService';
import { getRegularTemaplateData, renderDefaultImage } from './renderUtilsService';
import NodeCache from 'node-cache';

const imageCache = new NodeCache({
    stdTTL: 60,
    checkperiod: 60,
});

export async function generateRegularTemplate(steamid: string) {
    if (imageCache.has(steamid)) {
        return imageCache.get(steamid);
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
        );

        const image = await renderDefaultImage(imageData);

        imageCache.set(steamid, image);

        return image;
    } catch (e) {
        throw e;
    }
}
