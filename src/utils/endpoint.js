export const BASIC_URL = "http://localhost:8080";

export const API_VERSION_V1 = "/api/v1";

//==inquiry 관련 API URL==//
export const FAQ_URL = `${BASIC_URL}${API_VERSION_V1}/faqs`;
export const FAQ_TYPE_URL = (type) => `${BASIC_URL}${API_VERSION_V1}/faqs?faq-type=${type}`;
export const CREATE_FAQ_URL = `${BASIC_URL}${API_VERSION_V1}/admin/faqs/new`;
export const DELETE_FAQ_URL = (id) => `${BASIC_URL}${API_VERSION_V1}/admin/faqs/${id}`;
export const UPDATE_FAQ_URL = (id) => `${BASIC_URL}${API_VERSION_V1}/admin/faqs/${id}`;

export const USER_JOIN_URL = `${BASIC_URL}${API_VERSION_V1}/users`;
export const CHECK_EMAIL_URL = (email) => `${BASIC_URL}${API_VERSION_V1}/users/check-email?email=${email}`;
export const USER_LOGIN_URL = `${BASIC_URL}${API_VERSION_V1}/users/login`;
export const USER_PAGE_URL = `${BASIC_URL}${API_VERSION_V1}/users/myPage`;