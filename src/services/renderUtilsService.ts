import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { RegularTemplateData, RegularTemplateOptions } from '../interfaces/renderInterfaces';
import { PlayerSummary, RecentlyPlayedGame } from '../interfaces/steamInterfaces';
import express from 'express';

const regularTemplate = fs.readFileSync(path.join(__dirname, '../../src/templates/regular.hbs')).toString();
const pup = puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

export const OFFLINE_COLOR = '#808080';
export const ONLINE_COLOR = '#00BFFF';
export const PLAYING_COLOR = '#5DFC59';
export const AWAY_COLOR = '#FFA500';

export function getStateColor(player: PlayerSummary) {
    if (player.gameextrainfo) {
        return PLAYING_COLOR;
    }
    switch (player.personastate) {
        case 0:
            return OFFLINE_COLOR;
        case 1:
            return ONLINE_COLOR;
        case 3:
            return AWAY_COLOR;
        default:
            throw new Error('Unknown state');
    }
}

export function getStateString(player: PlayerSummary) {
    if (player.gameextrainfo) {
        return 'In a game';
    }
    switch (player.personastate) {
        case 0:
            return 'Offline';
        case 1:
            return 'Online';
        case 3:
            return 'Away';
        default:
            throw new Error('Unknown state');
    }
}

export function getBackgroundLink(gameid: string | number | null = null, color = '4e8ddb') {
    if (gameid === null) {
        // TODO: Add color based of user state
        color = color?.split('#')[1];
        return `https://singlecolorimage.com/get/${color}/460x215`;
    }
    return `https://cdn.cloudflare.steamstatic.com/steam/apps/${gameid}/header.jpg`;
}

export function getGameInfoAndPlayingState(
    recentlyPlayedGames: RecentlyPlayedGame[],
    playerSummary: PlayerSummary,
): [RecentlyPlayedGame | null, string] {
    // If player is playing a game
    if (!recentlyPlayedGames?.length) {
        return [null, "Didn't play anything recently"];
    }

    const gameid = playerSummary.gameid;
    let game = gameid !== undefined ? recentlyPlayedGames.find((el: RecentlyPlayedGame) => el.appid === parseInt(gameid)) : recentlyPlayedGames[0];

    let playingStateTitle = 'Recently played';
    if (gameid && game) {
        playingStateTitle = 'Currently playing';
    }

    // The game may not be found in recently played list due to steam not updating it in time
    if (!game) {
        game = recentlyPlayedGames[0];
    }

    return [game, playingStateTitle];
}

export function getLevelColor(level: number) {
    const lastTwoDigits = level % 100;
    if (lastTwoDigits >= 0 && lastTwoDigits <= 9) {
        return '#9b9b9b';
    } else if (lastTwoDigits >= 10 && lastTwoDigits <= 19) {
        return '#c02942';
    } else if (lastTwoDigits >= 20 && lastTwoDigits <= 29) {
        return '#d95b43';
    } else if (lastTwoDigits >= 30 && lastTwoDigits <= 39) {
        return '#fecc23';
    } else if (lastTwoDigits >= 40 && lastTwoDigits <= 49) {
        return '#467a3c';
    } else if (lastTwoDigits >= 50 && lastTwoDigits <= 59) {
        return '#4e8ddb';
    } else if (lastTwoDigits >= 60 && lastTwoDigits <= 69) {
        return '#7652c9';
    } else if (lastTwoDigits >= 70 && lastTwoDigits <= 79) {
        return '#c252c9';
    } else if (lastTwoDigits >= 80 && lastTwoDigits <= 89) {
        return '#542437';
    } else if (lastTwoDigits >= 90 && lastTwoDigits <= 99) {
        return '#997c52';
    }

    throw new Error('An error occurred while getting level color');
}

export function getRegularTemaplateData(
    recentlyPlayedGames: RecentlyPlayedGame[],
    playerSummary: PlayerSummary,
    playerLevel: number,
    options: RegularTemplateOptions,
) {
    const [gameInfo, playingStateTitle] = getGameInfoAndPlayingState(recentlyPlayedGames, playerSummary);

    let totalPlaytime: number | string = 'n/a';
    let twoWeeksPlaytime: number | string = 'n/a';
    let gameName = 'Nothing';
    const stateColor = getStateColor(playerSummary);
    const backgroundLink = options.gameBackground ? getBackgroundLink(gameInfo?.appid) : getBackgroundLink(null, stateColor);

    if (gameInfo !== null) {
        totalPlaytime = Math.round(gameInfo.playtime_forever / 60);
        twoWeeksPlaytime = Math.round(gameInfo.playtime_2weeks / 60);
        gameName = gameInfo.name;
    }

    const data: RegularTemplateData = {
        avatar: playerSummary.avatarfull,
        name: playerSummary.personaname,
        level: playerLevel,
        levelColor: getLevelColor(playerLevel),
        stateColor,
        stateName: getStateString(playerSummary),
        backgroundLink,
        gameName,
        playingStateTitle,
        totalPlaytime,
        twoWeeksPlaytime,
    };

    return data;
}

export async function renderDefaultImage(data: RegularTemplateData) {
    const compiled = handlebars.compile(regularTemplate);
    const html = compiled(data);
    const browser = await pup;
    const page = await browser.newPage();
    await page.setContent(html);
    const div = await page.$('div.wrapper');
    if (!div) {
        throw new Error('div not found');
    }
    const image = await div.screenshot({ type: 'png' });
    await page.close();

    return image;
}

export function getRegularTemaplateOptions(req: express.Request) {
    const options: RegularTemplateOptions = {
        gameBackground: req.query.gameBackground === '1',
    };

    return options;
}

export function generateCacheKey(steamid: string, templateType: 'regular', options: RegularTemplateOptions) {
    return `${steamid}-${templateType}-${options.gameBackground}`;
}
