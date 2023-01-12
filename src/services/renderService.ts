import {getLevel, getPlayerSummary, getRecentlyPlayed} from "./steamApiService";
import {
    getBackgroundLink,
    getGameInfoAndPlayingState,
    getLevelColor,
    getStateColor,
    getStateString
} from "./renderUtilsService";
import htmlToImage from "node-html-to-image";
import * as fs from "fs";
import * as path from "path";

const regularTemplate = fs.readFileSync(path.join(__dirname, '../../src/templates/regular.hbs')).toString()


export async function generateRegularTemplate(steamid: string) {
    const [playerSummary, recentlyPlayedGames] = await Promise.all([
        getPlayerSummary(steamid),
        getRecentlyPlayed(steamid)
    ])
    const playerLevelData = getLevel(steamid)
    const player = playerSummary.data.response.players[0]

    const [gameInfo, playingStateTitle] = getGameInfoAndPlayingState(recentlyPlayedGames.data.response.games, player)

    const bgImage = getBackgroundLink(gameInfo?.appid)
    const playerNick = player.personaname
    const playerStateName = getStateString(player)

    const gameName = gameInfo.name ?? 'Nothing'
    const totalPlaytime = Math.round(gameInfo.playtime_forever / 60)
    const twoWeeksPlaytime = Math.round(gameInfo.playtime_2weeks / 60)
    const playerStateColor = getStateColor(player)
    const playerAvatar = player.avatarfull // fixme: add default avatar
    const playerLevel = (await playerLevelData).data.response.player_level
    const levelColor = getLevelColor(playerLevel)

    return htmlToImage({
        html: regularTemplate,
        content: {
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
            levelColor
        },
        puppeteerArgs: {
            timeout: 10000
        }
    })
}
