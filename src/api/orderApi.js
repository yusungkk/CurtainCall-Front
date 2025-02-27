import { fetcher } from "/src/utils/fetcher";
import {
    RESERVED_SEATS_URL,
    CANCEL_ORDER_URL,
    COMPLETE_ORDER_URL,
    CREATE_ORDER_URL,
    FAIL_ORDER_URL,
    ORDER_HISTORY_URL,
    SUCCESS_ORDER_URL,
} from "/src/utils/endpoint";

// 예약된 좌석 목록 가져오기
export const getReservedSeats = async (productDetailId) => {
    return await fetcher(`${RESERVED_SEATS_URL}?productDetailId=${productDetailId}`);
};

// 주문 내역 조회
export const getOrderHistory = async (email) => {
    return await fetcher(ORDER_HISTORY_URL, {
        method: "POST",
        body: JSON.stringify({ email: email }),
    });
};

// 방금 성공한 주문 조회
export const getOrderSuccess = async (orderId) => {
    return await fetcher(SUCCESS_ORDER_URL(orderId));
};

// 주문 생성
export const createOrder = async (orderData) => {
    return await fetcher(CREATE_ORDER_URL, {
        method: "POST",
        body: JSON.stringify(orderData),
        headers: { "Content-Type": "application/json" },
    });
};

// 주문 취소
export const cancelOrder = async (orderId) => {
    return await fetcher(CANCEL_ORDER_URL(orderId), {
        method: "POST",
    });
};

// 주문 성공 처리
export const completeOrder = async (orderId) => {
    return await fetcher(COMPLETE_ORDER_URL.replace("{orderId}", orderId), {
        method: "PUT",
    });
};

// 주문 실패 처리
export const failOrder = async (orderId) => {
    return await fetcher(FAIL_ORDER_URL.replace("{orderId}", orderId), {
        method: "PUT",
    });
};
