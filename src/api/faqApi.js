import {fetcher} from "../utils/fetcher.js";
import {CREATE_FAQ_URL, DELETE_FAQ_URL, FAQ_TYPE_URL, FAQ_URL, UPDATE_FAQ_URL} from "../utils/endpoint.js";


export const getFaq = async (id) => {
    const URL = `${FAQ_URL}/${id}`;
    return await fetcher(URL);
}

export const getFaqs = async (offset = 0, limit = 10) => {
    const URL = `${FAQ_URL}?offset=${offset}&limit=${limit}`
    return await fetcher(URL);
}

export const getFaqsByType = async (faqType, offset = 0, limit = 10) => {
    const URL = `${FAQ_TYPE_URL(faqType)}&offset=${offset}&limit=${limit}`;
    return await fetcher(URL);
}

export const createFaq = async (faqData) => {
    return fetcher(CREATE_FAQ_URL, {
        method: "POST",
        body: JSON.stringify(faqData),
    });
}

export const updateFaq = async (faqData, id) => {
    return fetcher(UPDATE_FAQ_URL(id), {
        method: "PATCH",
        body: JSON.stringify(faqData),
    });
}

export const deleteFaq = async (id) => {
    return fetcher(DELETE_FAQ_URL(id), {
        method: "DELETE"
    });
}