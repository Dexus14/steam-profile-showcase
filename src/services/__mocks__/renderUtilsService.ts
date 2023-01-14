import { PlayerSummary, RecentlyPlayedGame } from '../../interfaces/steamInterfaces';

export const PLAYER_LEVEL_MOCK = 50;

export const RECENTLY_PLAYED_GAME_CSGO_MOCK: RecentlyPlayedGame = {
    appid: 730,
    name: 'Counter-Strike: Global Offensive',
    playtime_2weeks: 300,
    playtime_forever: 600,
    img_icon_url: 'csgo_img_icon_url',
    playtime_windows_forever: 150,
    playtime_mac_forever: 30,
    playtime_linux_forever: 60,
};

export const RECENTLY_PLAYED_GAME_DOTA2_MOCK: RecentlyPlayedGame = {
    appid: 570,
    name: 'Dota 2',
    playtime_2weeks: 20,
    playtime_forever: 60,
    img_icon_url: 'dota_img_icon_url',
    playtime_windows_forever: 10,
    playtime_mac_forever: 20,
    playtime_linux_forever: 30,
};

export const PLAYER_ACTIVE_SUMMARY_MOCK: PlayerSummary = {
    steamid: '765611980',
    communityvisibilitystate: 3,
    profilestate: 1,
    personaname: 'Player 1',
    commentpermission: 1,
    profileurl: 'https://steamcommunity.com/id/player1',
    avatar: 'player1_avatar',
    avatarmedium: 'player1_avatar_medium',
    avatarfull: 'player1_avatar_full',
    avatarhash: 'player1_avatar_hash',
    lastlogoff: 1580000000,
    personastate: 1,
    realname: 'John Doe',
    primaryclanid: '123456789',
    timecreated: 1570000000,
    personastateflags: 0,
    loccountrycode: 'US',
};

export const PLAYER_PLAYING_SUMMARY_MOCK: PlayerSummary = {
    ...PLAYER_ACTIVE_SUMMARY_MOCK,
    gameextrainfo: 'Counter-Strike: Global Offensive',
    gameid: '730',
};
