import { fetcher } from "/src/utils/fetcher";
import { PAYMENT_URL } from "/src/utils/endpoint";
import {completeOrder, failOrder} from "./orderApi.js";

// 결제 저장
export const savePayment = async (paymentData) => {
    return await fetcher(PAYMENT_URL, {
        method: "POST",
        body: JSON.stringify(paymentData),
        headers: { "Content-Type": "application/json" },
    });
};

// 포트원 결제 실행 함수
export const initiatePayment = (orderId, product, selectedSeats, paymentMethod, navigate, finalPrice) => {
    const { IMP } = window;
    IMP.init("imp67361044"); // 포트원 가맹점 식별 코드

    IMP.request_pay(
        {
            pg: "html5_inicis", // 고정
            pay_method: paymentMethod,
            merchant_uid: `order_${orderId}`,
            name: product.productName,
            amount: selectedSeats.length * finalPrice,
            buyer_email: "test@example.com",
            buyer_name: "홍길동",
        },
        async (rsp) => {
            if (rsp.success) {
                const paymentData = {
                    paymentNo: rsp.imp_uid,
                    payStatus: rsp.status,
                    price: rsp.paid_amount,
                    cardName: rsp.card_name,
                    orderId: orderId,
                };

                try {
                    const response = await savePayment(paymentData);

                    if (response) {
                        await completeOrder(orderId);
                        alert("결제 성공! 주문이 완료되었습니다.");
                        navigate("/confirmation", { state: { orderId } });
                    }
                } catch (error) {
                    console.error("결제 저장 또는 주문 완료 처리 중 오류:", error);
                    alert("결제는 성공했지만 주문 상태 업데이트에 실패했습니다.");
                }
            } else {
                console.error("결제 실패:", rsp);
                try {
                    await failOrder(orderId);
                    alert(`결제 실패: ${rsp.error_msg}`);
                } catch (error) {
                    console.error("주문 실패 상태 업데이트 오류:", error);
                }
            }
        }
    );
};
