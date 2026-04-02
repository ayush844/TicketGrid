import { callPublicApi } from "./publicApi"

export const getEvents = async(page=1, limit=10) => {
    const res = await callPublicApi(`/events?page=${page}&limit=${limit}`);
    return res;
}

export const getUpcomingEvents = async (page = 1, limit = 10) => {
  return callPublicApi(`/events/upcoming?page=${page}&limit=${limit}`);
};

export const getPastEvents = async (page = 1, limit = 10) => {
  return callPublicApi(`/events/past?page=${page}&limit=${limit}`);
};