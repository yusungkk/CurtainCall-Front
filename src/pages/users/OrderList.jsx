import "/src/pages/users/OrderList.css";
import CancelBtn from "/src/components/CancelBtn.jsx";

import { cancelCompletedOrder } from "/src/api/orderApi.js";

const OrderList = ({ user, orders, updateOrders }) => {
    const fetchOrderCancel = async (orderNo) => {
        const response = await cancelCompletedOrder(orderNo);

        if (response === 204) {
            alert("예매가 정상적으로 취소되었습니다.");
            const updatedOrders = orders.filter((order) => order.orderNo !== orderNo);
            updateOrders(updatedOrders);
        }
    };

    const handleOrderCancel = (orderNo) => {
        if (window.confirm("정말 예매를 취소하시겠습니까?")) {
            fetchOrderCancel(orderNo);
        }
    };

    if (!user) {
        return <div>사용자 정보를 불러올 수 없습니다.</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="order-list-container">
                <h3 className="empty-text">예매 내역이 없습니다.</h3>
            </div>
        );
    }

    return (
        <div className="order-list-container">
            {orders.map((order) => (
                <div key={order.orderNo} className="order-container">
                    <div className="order-header">
                        <h5 className="header-text">{order.orderNo}</h5>
                    </div>
                    <div className="order-body">
                        <div className="order-body-left">
                            <div className="poster-box">
                                <img src={order.imageUrl} alt={order.productName} />
                            </div>
                            <ul className="info">
                                <li className="info-item">
                                    <strong className="info-label">상품명</strong>
                                    <div className="info-text">{order.productName}</div>
                                </li>
                                <li className="info-item">
                                    <strong className="info-label">공연일</strong>
                                    <div className="info-text">
                                        {order.performanceDate.replace(/-/g, ".")} {order.performanceTime}
                                    </div>
                                </li>
                                <li className="info-item">
                                    <strong className="info-label">좌석</strong>
                                    <div className="info-text">
                                        {order.seats.length > 1 ? order.seats.join(", ") : order.seats}
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="order-body-right">
                            <div className="order-price-text">{order.orderPrice.toLocaleString("ko-KR")}원</div>
                            <div>
                                <CancelBtn
                                    onClick={() => handleOrderCancel(order.orderNo)}
                                    viewName={"예매취소"}
                                ></CancelBtn>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderList;
