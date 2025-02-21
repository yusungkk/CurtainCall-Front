import { fetcher } from "../utils/fetcher.js";
import { CHECK_EMAIL_URL, USER_JOIN_URL, USER_LOGIN_URL, USER_PAGE_URL, USER_UPDATE_URL, GET_USER_LIST_URL, USER_LOGOUT_URL,
 USER_ACTIVATE_URL, USER_DEACTIVATE_URL } from "../utils/endpoint.js";

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
    return await fetcher(USER_PAGE_URL, {
        method: "GET",
    });
};

export const updateUser = async (updateData) => {
    return await fetcher(USER_UPDATE_URL, {
        method: "PUT",
        body: JSON.stringify(updateData),
    });
};

export const getUserList = async () => {
    return await fetcher(GET_USER_LIST_URL, {
        method: "GET",
    });
};

export const logout = async () => {
    return await fetcher(USER_LOGOUT_URL, {
        method: "POST",
    });
};

export const activate = async (id) => {
    return await fetcher(USER_ACTIVATE_URL(id), {
        method: "PATCH",
    });
};

export const deactivate = async (id) => {
    return await fetcher(USER_DEACTIVATE_URL(id), {
        method: "PATCH",
    });
};