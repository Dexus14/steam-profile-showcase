import axios from "axios";

export function getPlayerSummary(steamid: string) {
    return makeGetRequest("/ISteamUser/GetPlayerSummaries/v2/", {
        steamids: steamid
    })
}

function makeGetRequest(gateway: string, params: any = {}) {
    const url = process.env.STEAM_WEB_API_URL + gateway
    params.key = process.env.STEAM_WEB_API_KEY
    return axios.get(url, {
        params
    })
}
