export const BASIC_URL = "http://localhost:8080";

export const API_VERSION_V1 = "/api/v1";

//==inquiry 관련 API URL==//
export const FAQ_URL = `${BASIC_URL}${API_VERSION_V1}/faqs`;
export const FAQ_TYPE_URL = (type) => `${BASIC_URL}${API_VERSION_V1}/faqs?faq-type=${type}`;
export const CREATE_FAQ_URL = `${BASIC_URL}${API_VERSION_V1}/admin/faqs/new`;
export const DELETE_FAQ_URL = (id) => `${BASIC_URL}${API_VERSION_V1}/admin/faqs/${id}`;
export const UPDATE_FAQ_URL = (id) => `${BASIC_URL}${API_VERSION_V1}/admin/faqs/${id}`;

export const CREATE_INQUIRY_URL = `${BASIC_URL}${API_VERSION_V1}/inquiries/new`;
export const FIND_INQUIRIES_USER_URL = `${BASIC_URL}${API_VERSION_V1}/inquiries`;
export const FIND_INQUIRY_USER_URL= (id)  => `${BASIC_URL}${API_VERSION_V1}/inquiries/${id}`
export const FIND_INQUIRIES_ADMIN_URL = `${BASIC_URL}${API_VERSION_V1}/admin/inquiries`;
export const FIND_INQUIRY_ADMIN_URL= (id) => `${BASIC_URL}${API_VERSION_V1}/admin/inquiries/${id}`;
export const CREATE_REPLY_ADMIN_URL= (id) => `${BASIC_URL}${API_VERSION_V1}/admin/inquiries/${id}/replies`;

//==채팅 관련 API URL ==//
export const CREATE_CHAT_ROOM_URL = (userId) => `${BASIC_URL}${API_VERSION_V1}/chat/create?user=${userId}`
export const FIND_ALL_CHAT_ROOM_URL = `${BASIC_URL}${API_VERSION_V1}/chat/rooms`
export const WS_CONNECT_URL = `${BASIC_URL}/ws-chat-connect`;
export const WS_CHAT_PUB_URL = (roomId) => `/app/chat/${roomId}`;
export const WS_CHAT_SUB_URL = (roomId) => `/queue/chat/${roomId}`;

//==product 관련 API URL==//
export const PRODUCT_URL = `${BASIC_URL}${API_VERSION_V1}/products`;
export const CREATE_PRODUCT_URL = `${BASIC_URL}${API_VERSION_V1}/products/new`;
export const UPDATE_PRODUCT_URL = (id) => `${BASIC_URL}${API_VERSION_V1}/products/${id}`;
export const DELETE_PRODUCT_URL = (id) => `${BASIC_URL}${API_VERSION_V1}/products/${id}`;
export const RECOMMEND_URL = "http://localhost:8080/api/recommend";

export const USER_JOIN_URL = `${BASIC_URL}${API_VERSION_V1}/users`;
export const CHECK_EMAIL_URL = (email) => `${BASIC_URL}${API_VERSION_V1}/users/check-email?email=${email}`;
export const USER_LOGIN_URL = `${BASIC_URL}${API_VERSION_V1}/users/login`;
export const USER_PAGE_URL = `${BASIC_URL}${API_VERSION_V1}/users/myPage`;
export const USER_UPDATE_URL = `${BASIC_URL}${API_VERSION_V1}/users/update`;
export const GET_USER_LIST_URL = `${BASIC_URL}${API_VERSION_V1}/users`;
export const USER_LOGOUT_URL = `${BASIC_URL}${API_VERSION_V1}/users/logout`;
export const USER_ACTIVATE_URL = (id) => `${BASIC_URL}${API_VERSION_V1}/users/${id}/activate`;
export const USER_DEACTIVATE_URL = (id) => `${BASIC_URL}${API_VERSION_V1}/users/${id}/deactivate`;

//special-product
export const SPECIAL_PRODUCT_URL = `${BASIC_URL}${API_VERSION_V1}/special-product`;


//홈화면
export const ACTIVE_SPECIAL_PRODUCT_URL =`${BASIC_URL}${API_VERSION_V1}/specialProduct/active`;
