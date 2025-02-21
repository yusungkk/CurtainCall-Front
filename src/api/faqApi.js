import {fetcher} from "../utils/fetcher.js";
import {
    CREATE_FAQ_URL,
    CREATE_INQUIRY_URL, CREATE_REPLY_ADMIN_URL,
    DELETE_FAQ_URL,
    FAQ_TYPE_URL,
    FAQ_URL, FIND_INQUIRIES_ADMIN_URL, FIND_INQUIRIES_USER_URL, FIND_INQUIRY_ADMIN_URL, FIND_INQUIRY_USER_URL,
    UPDATE_FAQ_URL
} from "../utils/endpoint.js";

export const getFaq = async (id) => {
    const URL = `${FAQ_URL}/${id}`;
    return await fetcher(URL);
}

export const getFaqs = async (offset = 0, limit = 10) => {
    const URL = `${FAQ_URL}?offset=${offset}&limit=${limit}`
    return await fetcher(URL, {
        credentials: "include",
    });
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

export const createInquiry = async (inquiryData) => {
    return fetcher(CREATE_INQUIRY_URL, {
        method: "POST",

        body: JSON.stringify(inquiryData),
    });
};

export const getInquiriesByUser = async (navigate) => {

    return await fetcher(FIND_INQUIRIES_USER_URL);
};

export const getInquiriesByAdmin = async (navigate, searchCond, offset = 0) => {

    let URL = FIND_INQUIRIES_ADMIN_URL;

    const queryParam = Object.entries(searchCond)
        .filter(([key, value]) => value !== '')
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

    if (queryParam !== '') {
        URL += `?${queryParam}&offset=${offset}`;
    } else {
        URL += `?offset=${offset}`;
    }
    return await fetcher(URL);
};

export const getInquiryByUser = async (navigate, id) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
        navigate("/login");
        return;
    }
    return await fetcher(FIND_INQUIRY_USER_URL(id));
};

export const getInquiryByAdmin = async (navigate, id) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
        navigate("/login");
        return;
    }

    return await fetcher(FIND_INQUIRY_ADMIN_URL(id));
};

export const createReplyByAdmin = async (navigate, id, body) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
        navigate("/login");
        return;
    }

    return await fetcher(CREATE_REPLY_ADMIN_URL(id), {
        method: "POST",
        body: JSON.stringify(body),
    });
}