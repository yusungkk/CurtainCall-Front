import { fetcher } from "../utils/fetcher.js";
import { CHECK_EMAIL_URL, USER_JOIN_URL, USER_LOGIN_URL, USER_PAGE_URL } from "../utils/endpoint.js";

export const checkEmailDuplicate = async (email) => {
    return await fetcher(CHECK_EMAIL_URL(email));
};

export const createUser = async (userData) => {
    return await fetcher(USER_JOIN_URL, {
        method: "POST",
        body: JSON.stringify(userData),
    });
};

export const login = async (loginForm) => {
    return await fetcher(USER_LOGIN_URL, {
        method: "POST",
        body: JSON.stringify(loginForm),
    });
};

export const getUserDate = async (token) => {
    return await fetcher(USER_PAGE_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
};