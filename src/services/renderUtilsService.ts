import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const regularTemplate = fs.readFileSync(path.join(__dirname, '../../src/templates/regular.hbs')).toString();
const pup = puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

export function getStateColor(player: any) {
    if (player.gameextrainfo) {
        return '#5DFC59';
    }
    switch (player.personastate) {
        case 0:
            return '#808080';
        case 1:
            return 'deepskyblue';
        case 3:
            return 'orange';
    }
}

export function getStateString(player: any) {
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
    }
}

export function getBackgroundLink(gameid?: string) {
    if (!gameid) {
        return 'https://singlecolorimage.com/get/4e8ddb/460x215';
    }
    return `https://cdn.cloudflare.steamstatic.com/steam/apps/${gameid}/header.jpg`;
}

export function getGameInfoAndPlayingState(recentlyPlayedGames: any[], player: any): [any, string] {
    // If player is playing a game
    if (!recentlyPlayedGames?.length) {
        // FIXME: Find a better way to handle this
        return [{}, "Didn't play anything recently"];
    }

    let game = player.gameid ? recentlyPlayedGames.find((el: any) => el.appid === parseInt(player.gameid)) : recentlyPlayedGames[0];

    let playingStateTitle = 'Recently played';
    if (player.gameid && game) {
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

export async function renderDefaultImage(data: any) {
    // TODO: Add type
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
