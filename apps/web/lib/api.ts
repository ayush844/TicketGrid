import { callPublicApi } from "./publicApi"

export const getEvents = async(page=1, limit=10) => {
    const res = await callPublicApi(`/events?page=${page}&limit=${limit}`);
    console.log("response is: ", res);
    return res;
}