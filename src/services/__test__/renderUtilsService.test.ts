import { getGameInfoAndPlayingState, getLevelColor, getRegularTemaplateData, getStateColor, getStateString } from '../renderUtilsService';
import {
    PLAYER_ACTIVE_SUMMARY_MOCK,
    PLAYER_LEVEL_MOCK,
    PLAYER_PLAYING_SUMMARY_MOCK,
    RECENTLY_PLAYED_GAME_CSGO_MOCK,
    RECENTLY_PLAYED_GAME_DOTA2_MOCK,
} from '../__mocks__/renderUtilsService';
import { RecentlyPlayedGame } from '../../interfaces/steamInterfaces';

describe('renderUtilsService', () => {
    test('getRegularTemaplateData - csgo player', () => {
        const recentlyPlayedGames = [RECENTLY_PLAYED_GAME_CSGO_MOCK, RECENTLY_PLAYED_GAME_DOTA2_MOCK];
        const result = getRegularTemaplateData(recentlyPlayedGames, PLAYER_ACTIVE_SUMMARY_MOCK, PLAYER_LEVEL_MOCK);

        expect(result).toEqual({
            avatar: PLAYER_ACTIVE_SUMMARY_MOCK.avatarfull,
            name: PLAYER_ACTIVE_SUMMARY_MOCK.personaname,
            level: PLAYER_LEVEL_MOCK,
            levelColor: '#4e8ddb',
            stateColor: 'deepskyblue',
            stateName: 'Online',
            // Background link should return the first game in the list
            backgroundLink: `https://cdn.cloudflare.steamstatic.com/steam/apps/${recentlyPlayedGames[0].appid}/header.jpg`,
            gameName: recentlyPlayedGames[0].name,
            playingStateTitle: 'Recently played',
            totalPlaytime: Math.round(recentlyPlayedGames[0].playtime_forever / 60),
            twoWeeksPlaytime: Math.round(recentlyPlayedGames[0].playtime_2weeks / 60),
        });
    });

    test('getRegularTemaplateData - not playing', () => {
        const recentlyPlayedGames: RecentlyPlayedGame[] = [];
        const result = getRegularTemaplateData(recentlyPlayedGames, PLAYER_ACTIVE_SUMMARY_MOCK, PLAYER_LEVEL_MOCK);

        expect(result).toEqual({
            avatar: PLAYER_ACTIVE_SUMMARY_MOCK.avatarfull,
            name: PLAYER_ACTIVE_SUMMARY_MOCK.personaname,
            level: PLAYER_LEVEL_MOCK,
            levelColor: '#4e8ddb',
            stateColor: 'deepskyblue',
            stateName: 'Online',
            // Background link should return the first game in the list
            backgroundLink: `https://singlecolorimage.com/get/4e8ddb/460x215`,
            gameName: 'Nothing',
            playingStateTitle: "Didn't play anything recently",
            totalPlaytime: 'n/a',
            twoWeeksPlaytime: 'n/a',
        });
    });

    test('getLevelColor - throw on incorrect level', () => {
        const INCORRECT_LEVEL = 125;

        const color = getLevelColor(INCORRECT_LEVEL);

        expect(typeof color).toBe('string');
    });

    test('getStateColor - return string', () => {
        const CORRECT_STATE = 2;

        const color = getLevelColor(CORRECT_STATE);

        expect(typeof color).toBe('string');
    });

    test('getStateColor - return game color', () => {
        const color = getStateColor(PLAYER_PLAYING_SUMMARY_MOCK);

        expect(color).toBe('#5DFC59');
    });

    test('getStateString - return game string', () => {
        const state = getStateString(PLAYER_PLAYING_SUMMARY_MOCK);

        expect(state).toBe('In a game');
    });

    test('getGameInfoAndPlayingState - return game string', () => {
        const [gameInfo, playingStateTitle] = getGameInfoAndPlayingState(
            [RECENTLY_PLAYED_GAME_DOTA2_MOCK, RECENTLY_PLAYED_GAME_CSGO_MOCK],
            PLAYER_PLAYING_SUMMARY_MOCK,
        );

        expect(gameInfo).toEqual(RECENTLY_PLAYED_GAME_CSGO_MOCK);
        expect(playingStateTitle).toBe('Currently playing');
    });

    test('getGameInfoAndPlayingState - return game if currently played is not in recently played', () => {
        const [gameInfo, playingStateTitle] = getGameInfoAndPlayingState([RECENTLY_PLAYED_GAME_DOTA2_MOCK], PLAYER_PLAYING_SUMMARY_MOCK);

        expect(gameInfo).toEqual(RECENTLY_PLAYED_GAME_DOTA2_MOCK);
        expect(playingStateTitle).toBe('Recently played');
    });
});
