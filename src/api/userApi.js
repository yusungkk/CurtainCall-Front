import { fetcher } from "../utils/fetcher.js";
import { CHECK_EMAIL_URL, USER_JOIN_URL, USER_LOGIN_URL, USER_PAGE_URL, USER_UPDATE_URL, GET_USER_LIST_URL } from "../utils/endpoint.js";

export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

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

export const getUserData = async () => {
    const token = getCookie("jwt");
    if (token) {
        return await fetcher(USER_PAGE_URL, {
            method: "GET",
            credentials: 'include',
        });
    }
    throw new Error("No token found in cookies");
};

export const updateUser = async (updateData) => {
    const token = getCookie("jwt");
    if(token) {
        return await fetcher(USER_UPDATE_URL, {
            method: "PUT",
            credentials: 'include',
            body: JSON.stringify(updateData),
        });
    }
    throw new Error("No token found in cookies");
};

export const getUserList = async () => {
    const token = getCookie("jwt");
    if (token) {
        return await fetcher(GET_USER_LIST_URL, {
            method: "GET",
            credentials: 'include',
        });
    }
    throw new Error("No token found in cookies");
};