import axios from "axios";

export function getPlayerSummary(steamid: string) {
    return makeGetRequest("/ISteamUser/GetPlayerSummaries/v2/", {
        steamids: steamid
    })
}

export function getRecentlyPlayed(steamid: string) {
    return makeGetRequest("/IPlayerService/GetRecentlyPlayedGames/v1/", {
        steamid,
        count: 10
    })
}

export function getLevel(steamid: string) {
    return makeGetRequest("/IPlayerService/GetSteamLevel/v1/", {
        steamid
    })
}

function makeGetRequest(gateway: string, params: any = {}) {
    const url = process.env.STEAM_WEB_API_URL + gateway
    params.key = process.env.STEAM_WEB_API_KEY
    return axios.get(url, {
        params
    })
}
