export const API_VERSION_V1 = "/api/v1";

//==inquiry 관련 API URL==//
export const FAQ_URL = `${API_VERSION_V1}/faqs`;
export const FAQ_TYPE_URL = (type) => `${API_VERSION_V1}/faqs?faq-type=${type}`;
export const CREATE_FAQ_URL = `${API_VERSION_V1}/admin/faqs/new`;
export const DELETE_FAQ_URL = (id) => `${API_VERSION_V1}/admin/faqs/${id}`;
export const UPDATE_FAQ_URL = (id) => `${API_VERSION_V1}/admin/faqs/${id}`;

export const CREATE_INQUIRY_URL = `${API_VERSION_V1}/inquiries/new`;
export const FIND_INQUIRIES_USER_URL = `${API_VERSION_V1}/inquiries`;
export const FIND_INQUIRY_USER_URL= (id)  => `${API_VERSION_V1}/inquiries/${id}`
export const FIND_INQUIRIES_ADMIN_URL = `${API_VERSION_V1}/admin/inquiries`;
export const FIND_INQUIRY_ADMIN_URL= (id) => `${API_VERSION_V1}/admin/inquiries/${id}`;
export const CREATE_REPLY_ADMIN_URL= (id) => `${API_VERSION_V1}/admin/inquiries/${id}/replies`;

//==채팅 관련 API URL ==//
export const CREATE_CHAT_ROOM_URL = `${API_VERSION_V1}/chat-rooms/create`
export const FIND_ROOMS_BY_ACTIVE_URL = (active) => `${API_VERSION_V1}/chat-rooms?active=${active}`
export const UPDATE_CHAT_ROOM_URL = (roomId, active) => `${API_VERSION_V1}/chat-rooms?roomId=${roomId}&active=${active}`
export const FIND_MESSAGES_URL = (roomId, offset=0, limit=20) =>
    `${API_VERSION_V1}/chat/${roomId}?offset=${offset}&limit=${limit}`;
export const WS_CONNECT_URL = `/ws-chat-connect`;
export const WS_CHAT_PUB_URL = (roomId) => `/app/chat/${roomId}`;
export const WS_CHAT_SUB_URL = (roomId) => `/queue/chat/${roomId}`;

//==product 관련 API URL==//
export const PRODUCT_URL = `${API_VERSION_V1}/products`;
export const CREATE_PRODUCT_URL = `${API_VERSION_V1}/products/new`;
export const UPDATE_PRODUCT_URL = (id) => `${API_VERSION_V1}/products/${id}`;
export const DELETE_PRODUCT_URL = (id) => `${API_VERSION_V1}/products/${id}`;
export const RECOMMEND_URL = `${API_VERSION_V1}/recommend`;
export const PRODUCT_BY_DETAILID_URL =  `${API_VERSION_V1}/products/detail`;
export const PRODUCT_DETAILS_URL = `${API_VERSION_V1}/products/details`;


//==유저 관련 API URL==//
export const USER_JOIN_URL = `${API_VERSION_V1}/users`;
export const CHECK_EMAIL_URL = (email) => `${API_VERSION_V1}/users/check-email?email=${email}`;
export const USER_LOGIN_URL = `${API_VERSION_V1}/users/login`;
export const USER_PAGE_URL = `${API_VERSION_V1}/users/myPage`;
export const USER_UPDATE_URL = `${API_VERSION_V1}/users/update`;
export const GET_USER_LIST_URL = (page, size) => `${API_VERSION_V1}/users?page=${page}&size=${size}`;
export const USER_LOGOUT_URL = `${API_VERSION_V1}/users/logout`;
export const USER_ACTIVATE_URL = (id) => `${API_VERSION_V1}/users/${id}/activate`;
export const USER_DEACTIVATE_URL = (id) => `${API_VERSION_V1}/users/${id}/deactivate`;

export const CHECK_ADMIN_URL = `${API_VERSION_V1}/users/role`

export const GET_SEARCH_USER_URL = (keyword, page, size) => `${API_VERSION_V1}/users/search?keyword=${keyword}&page=${page}&size=${size}`;

//==카테고리 관련 API URL==//
export const CATEGORY_URL = `${API_VERSION_V1}/categories`;
export const DELETED_CATEGORY_URL = `${API_VERSION_V1}/categories/findAllDeleted`;
export const DELETE_CATEGORY_URL = (id) => `${API_VERSION_V1}/categories/${id}`;
export const RESTORE_CATEGORY_URL = (id) => `${API_VERSION_V1}/categories/restore/${id}`;


//==주문 관련 API URL==//
export const RESERVED_SEATS_URL = `${API_VERSION_V1}/reserved-seats`;
export const CREATE_ORDER_URL = `${API_VERSION_V1}/create`;
export const CANCEL_ORDER_URL = `${API_VERSION_V1}/{orderId}/cancel`;
export const COMPLETE_ORDER_URL = `${API_VERSION_V1}/{orderId}/complete`;
export const FAIL_ORDER_URL = `${API_VERSION_V1}/{orderId}/fail`;

//==결제 관련 API URL==//
export const PAYMENT_URL = `${API_VERSION_V1}/payment`;

//special-product
export const SPECIAL_PRODUCT_URL = `${API_VERSION_V1}/specialProduct`;
export const SEARCH_PRODUCTS_URL = `${API_VERSION_V1}/products/special-products/search`;



//홈화면
export const ACTIVE_SPECIAL_PRODUCT_URL =`${API_VERSION_V1}/specialProduct/active`;
