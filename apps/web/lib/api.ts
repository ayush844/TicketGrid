import { callPublicApi } from "./publicApi"

export const getEvents = async(page=1, limit=10) => {
    const res = await callPublicApi(`/events?page=${page}&limit=${limit}`);
    return res;
}

export const getUpcomingEvents = async (query: string) => {
  return callPublicApi(`/events/upcoming?${query}`);
};

export const getPastEvents = async (query: string) => {
  return callPublicApi(`/events/past?${query}`);
};