import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "/src/pages/orders/OrderSuccess.css";

function OrderSuccess() {
  const location = useLocation();
  const { orderId } = location.state || { orderId: null };
  const [orderSuccess, setOrderSuccess] = useState({
    orderNo: "",
    orderPrice: null,
    productName: "",
    performanceDate: null,
    performanceTime: null,
    seats: [],
    imageUrl: "",
  });

  // 주문 성공 응답 받아오기
  useEffect(() => {
    const fetchOrderSuccess = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/orders/${orderId}/success`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrderSuccess((prev) => ({
            ...prev,
            orderNo: data.orderNo,
            orderPrice: data.orderPrice,
            productName: data.productName,
            performanceDate: data.performanceDate,
            performanceTime: data.performanceTime,
            seats: data.seats,
            imageUrl: data.imageUrl,
          }));
        } else {
          throw new Error(await response.json());
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchOrderSuccess();
  }, []);

  console.log(orderSuccess);

  return (
    <div className="success-container">
      <div className="success-context">
        <h2>예매가 완료되었습니다!</h2>
      </div>

      <div className="success-main">
        <div className="success-main-top">
          <h5 className="order-label">주문번호</h5>
          <p>{orderSuccess.orderNo}</p>
        </div>

        <div className="success-main-body">
          <div className="poster-box">
            <img src={orderSuccess.imageUrl} alt={orderSuccess.productName} />
          </div>

          <ul className="info">
            <li className="info-item">
              <strong className="info-label">상품명</strong>
              <p className="info-text">{orderSuccess.productName}</p>
            </li>
            <li className="info-item">
              <strong className="info-label">공연시작</strong>
              <p className="info-text">
                {orderSuccess.performanceDate.replace(/-/g, ".")} {orderSuccess.performanceTime}
              </p>
            </li>
            <li className="info-item">
              <strong className="info-label">좌석</strong>
              <p className="info-text">{orderSuccess.seats}</p>
            </li>
            <li className="info-item">
              <strong className="info-label">주문가격</strong>
              <p className="info-text">{orderSuccess.orderPrice}</p>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <Link to="/myPage">
          <button className="order-list-btn">예매 목록</button>
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;
