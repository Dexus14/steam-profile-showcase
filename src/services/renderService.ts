import { getLevel, getPlayerSummary, getRecentlyPlayed } from './steamApiService';
import {
    getBackgroundLink,
    getGameInfoAndPlayingState,
    getLevelColor,
    getStateColor,
    getStateString,
    renderDefaultImage,
} from './renderUtilsService';
import NodeCache from 'node-cache';

const imageCache = new NodeCache({
    stdTTL: 60,
    checkperiod: 60,
});

export async function generateRegularTemplate(steamid: string) {
    if (imageCache.has(steamid)) {
        console.log('cache hit!');

        return imageCache.get(steamid);
    }

    const datastart = Date.now();
    const [playerSummary, recentlyPlayedGames] = await Promise.all([getPlayerSummary(steamid), getRecentlyPlayed(steamid)]);
    console.log('received steam data');
    const playerLevelData = getLevel(steamid);
    const player = playerSummary.data.response.players[0];

    const [gameInfo, playingStateTitle] = getGameInfoAndPlayingState(recentlyPlayedGames.data.response.games, player);

    const bgImage = getBackgroundLink(gameInfo?.appid);
    const playerNick = player.personaname;
    const playerStateName = getStateString(player);

    const gameName = gameInfo.name ?? 'Nothing';
    const totalPlaytime = Math.round(gameInfo.playtime_forever / 60);
    const twoWeeksPlaytime = Math.round(gameInfo.playtime_2weeks / 60);
    const playerStateColor = getStateColor(player);
    const playerAvatar = player.avatarfull; // fixme: add default avatar
    const playerLevel = (await playerLevelData).data.response.player_level;
    const levelColor = getLevelColor(playerLevel);

    const dataend = Date.now();
    console.log(`data received in ${dataend - datastart} ms`);
    console.log('rendering image');
    try {
        const renderstart = Date.now();

        const image = await renderDefaultImage({
            playerLevel,
            bgImage,
            playerNick,
            playerStateName,
            gameName,
            totalPlaytime,
            twoWeeksPlaytime,
            playerStateColor,
            playingStateTitle,
            playerAvatar,
            levelColor,
        });

        const renderend = Date.now();
        console.log(`rendered in ${renderend - renderstart} ms`);

        imageCache.set(steamid, image);
        return image;
    } catch (e) {
        throw e;
    }
}
