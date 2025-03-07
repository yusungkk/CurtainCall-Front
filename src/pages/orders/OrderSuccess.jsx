import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "/src/pages/orders/OrderSuccess.css";

import { getOrderSuccess } from "/src/api/orderApi.js";

function OrderSuccess() {
    const location = useLocation();
    const { orderId } = location.state || { orderId: null };
    const navigate = useNavigate();
    const [orderSuccess, setOrderSuccess] = useState({
        orderNo: null,
        orderPrice: null,
        productName: null,
        performanceDate: null,
        performanceTime: null,
        seats: [],
        imageUrl: null,
    });

    // 주문 성공 응답 받아오기
    useEffect(() => {
        const fetchOrderSuccess = async () => {
            const data = await getOrderSuccess(orderId);

            setOrderSuccess((prev) => ({
                ...prev,
                orderNo: data.orderNo,
                orderPrice: data.orderPrice,
                productName: data.productName,
                place: data.place,
                performanceDate: data.performanceDate.replace(/-/g, "."),
                performanceTime: data.performanceTime,
                seats: data.seats,
                imageUrl: data.imageUrl,
            }));
        };

        fetchOrderSuccess();
    }, []);

    const handleOrderHistoryClick = () => {
        navigate("/mypage?menu=orders");
    };

    return (
        <div className="success-container">
            <h2 className="success-title">예매가 완료되었습니다!</h2>

            <div className="success-main">
                <h5 className="order-label">
                    주문번호 <span>{orderSuccess.orderNo}</span>
                </h5>

                <div className="success-content">
                    <div className="poster-box">
                        <img src={orderSuccess.imageUrl} alt={orderSuccess.productName} />
                    </div>

                    <ul className="info">
                        <li className="info-item">
                            <strong className="info-label">상품명</strong>
                            <p className="info-text">{orderSuccess.productName}</p>
                        </li>
                        <li className="info-item">
                            <strong className="info-label">장소</strong>
                            <p className="info-text">{orderSuccess.place}</p>
                        </li>
                        <li className="info-item">
                            <strong className="info-label">공연시작</strong>
                            <p className="info-text">
                                {orderSuccess.performanceDate} / {orderSuccess.performanceTime}
                            </p>
                        </li>
                        <li className="info-item">
                            <strong className="info-label">좌석</strong>
                            <p className="info-text">
                                {orderSuccess.seats.length > 1 ? orderSuccess.seats.join(", ") : orderSuccess.seats}
                            </p>
                        </li>
                        <li className="info-item">
                            <strong className="info-label">주문가격</strong>
                            <p className="info-text">{orderSuccess.orderPrice} 원</p>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="confirm-button">
                <button className="home-btn" onClick={() => navigate(`/`)}>
                    메인 화면
                </button>
                <button className="order-list-btn" onClick={handleOrderHistoryClick}>
                    예매 목록
                </button>
            </div>
        </div>
    );
}

export default OrderSuccess;
