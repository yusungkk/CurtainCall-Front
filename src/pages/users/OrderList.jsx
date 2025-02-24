import "/src/pages/users/OrderList.css";
import CancelBtn from "/src/components/CancelBtn.jsx";

const OrderList = ({ user, orders, updateOrders }) => {
    const fetchOrderCancel = async (orderNo) => {
        try {
            const response = await fetch(`http://localhost:8080/api/orders/cancel`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderNo }),
            });

            if (response.status === 204) {
                alert("예매가 정상적으로 취소되었습니다.");
                const updatedOrders = orders.filter((order) => order.orderNo !== orderNo);
                updateOrders(updatedOrders);
            } else {
                throw new Error(await response.json());
            }
        } catch (e) {
            console.log(e);
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
                                    <p className="info-text">{order.productName}</p>
                                </li>
                                <li className="info-item">
                                    <strong className="info-label">공연일</strong>
                                    <p className="info-text">
                                        {order.performanceDate.replace(/-/g, ".")}{" "}
                                        {order.performanceTime}
                                    </p>
                                </li>
                                <li className="info-item">
                                    <strong className="info-label">좌석</strong>
                                    <p className="info-text">
                                        {order.seats.length > 1
                                            ? order.seats.join(", ")
                                            : order.seats}
                                    </p>
                                </li>
                            </ul>
                        </div>

                        <div className="order-body-right">
                            <div className="order-price-text">{order.orderPrice}원</div>
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
