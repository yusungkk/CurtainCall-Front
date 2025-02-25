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
export const CREATE_CHAT_ROOM_URL = (userId) => `${BASIC_URL}${API_VERSION_V1}/chat-rooms/create?user=${userId}`
export const FIND_ROOMS_WITHOUT_ADMIN_URL = (active) => `${BASIC_URL}${API_VERSION_V1}/chat-rooms?active=${active}`
export const ASSIGN_CHAT_ROOM_URL = (roomId) => `${BASIC_URL}${API_VERSION_V1}/chat-rooms?roomId=${roomId}`
export const FIND_MESSAGES_URL = (roomId, offset=0, limit=20) =>
    `${BASIC_URL}${API_VERSION_V1}/chat/${roomId}?offset=${offset}&limit=${limit}`;
export const WS_CONNECT_URL = `${BASIC_URL}/ws-chat-connect`;
export const WS_CHAT_PUB_URL = (roomId) => `/app/chat/${roomId}`;
export const WS_CHAT_SUB_URL = (roomId) => `/queue/chat/${roomId}`;

//==product 관련 API URL==//
export const PRODUCT_URL = `${BASIC_URL}${API_VERSION_V1}/products`;
export const CREATE_PRODUCT_URL = `${BASIC_URL}${API_VERSION_V1}/products/new`;
export const UPDATE_PRODUCT_URL = (id) => `${BASIC_URL}${API_VERSION_V1}/products/${id}`;
export const DELETE_PRODUCT_URL = (id) => `${BASIC_URL}${API_VERSION_V1}/products/${id}`;
export const RECOMMEND_URL = "http://localhost:8080/api/recommend";
export const PRODUCT_BY_DETAILID_URL =  `${BASIC_URL}${API_VERSION_V1}/products/detail`;
export const PRODUCT_DETAILS_URL = `${BASIC_URL}${API_VERSION_V1}/products/details`;


//==유저 관련 API URL==//
export const USER_JOIN_URL = `${BASIC_URL}${API_VERSION_V1}/users`;
export const CHECK_EMAIL_URL = (email) => `${BASIC_URL}${API_VERSION_V1}/users/check-email?email=${email}`;
export const USER_LOGIN_URL = `${BASIC_URL}${API_VERSION_V1}/users/login`;
export const USER_PAGE_URL = `${BASIC_URL}${API_VERSION_V1}/users/myPage`;
export const USER_UPDATE_URL = `${BASIC_URL}${API_VERSION_V1}/users/update`;
export const GET_USER_LIST_URL = (page, size) => `${BASIC_URL}${API_VERSION_V1}/users?page=${page}&size=${size}`;
export const USER_LOGOUT_URL = `${BASIC_URL}${API_VERSION_V1}/users/logout`;
export const USER_ACTIVATE_URL = (id) => `${BASIC_URL}${API_VERSION_V1}/users/${id}/activate`;
export const USER_DEACTIVATE_URL = (id) => `${BASIC_URL}${API_VERSION_V1}/users/${id}/deactivate`;

export const CHECK_ADMIN_URL = `${BASIC_URL}${API_VERSION_V1}/users/role`

export const GET_SEARCH_USER_URL = (keyword, page, size) => `${BASIC_URL}${API_VERSION_V1}/users/search?keyword=${keyword}&page=${page}&size=${size}`;

//==카테고리 관련 API URL==//
export const CATEGORY_URL = `${BASIC_URL}${API_VERSION_V1}/categories`;


//==주문 관련 API URL==//
export const RESERVED_SEATS_URL = `${BASIC_URL}${API_VERSION_V1}/reserved-seats`;
export const CREATE_ORDER_URL = `${BASIC_URL}${API_VERSION_V1}/create`;
export const CANCEL_ORDER_URL = `${BASIC_URL}${API_VERSION_V1}/{orderId}/cancel`;
export const COMPLETE_ORDER_URL = `${BASIC_URL}${API_VERSION_V1}/{orderId}/complete`;
export const FAIL_ORDER_URL = `${BASIC_URL}${API_VERSION_V1}/{orderId}/fail`;

//==결제 관련 API URL==//
export const PAYMENT_URL = `${BASIC_URL}${API_VERSION_V1}/payment`;

//special-product
export const SPECIAL_PRODUCT_URL = `${BASIC_URL}${API_VERSION_V1}/special-product`;


//홈화면
export const ACTIVE_SPECIAL_PRODUCT_URL =`${BASIC_URL}${API_VERSION_V1}/specialProduct/active`;
