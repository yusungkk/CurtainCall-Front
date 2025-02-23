import "/src/pages/users/OrderList.css";
import CancelBtn from "/src/components/CancelBtn.jsx";

const handleOrderCancel = () => {};

const OrderList = ({ user, orders }) => {
  if (!user) {
    return <div>사용자 정보를 불러올 수 없습니다.</div>;
  }

  if (!orders) {
    return <div>예매 내역이 없습니다.</div>;
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
                    {order.performanceDate.replace(/-/g, ".")} {order.performanceTime}
                  </p>
                </li>
                <li className="info-item">
                  <strong className="info-label">좌석</strong>
                  <p className="info-text">
                    {order.seats.length > 1 ? order.seats.join(", ") : order.seats}
                  </p>
                </li>
              </ul>
            </div>

            <div className="order-body-right">
              <div className="order-price-text">{order.orderPrice}원</div>
              <div>
                <CancelBtn onClick={handleOrderCancel} viewName={"예매취소"}></CancelBtn>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
