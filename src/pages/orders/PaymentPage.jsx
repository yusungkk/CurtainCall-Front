import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./PaymentPage.css";
import { getUserData } from "/src/api/userApi.js";
import { getProductByDetailId, getProductDetail } from "/src/api/productApi.js";
import { createOrder, cancelOrder } from "/src/api/orderApi.js";
import { initiatePayment } from "/src/api/paymentApi.js";
import PaymentInfo from "../../components/orders/PaymentInfo";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { productDetailId, selectedSeats } = location.state || {
    productDetailId: null,
    selectedSeats: [],
  };
  const [product, setProduct] = useState(null);
  const [productDetail, setProductDetail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderId, setOrderId] = useState(null);
  const [isPaymentStarted, setIsPaymentStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    alert(
      "*** 주의: 결제하기 버튼을 누르신 후 5분 안에 결제가 완료되지 않으면 결제가 자동으로 취소되니 유의 바랍니다. ***\n(선택하신 좌석도 해제됩니다.)"
    );

    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        console.log(response);

        if (!response) {
          alert("로그인이 필요합니다.");
          navigate("/login");
        } else {
          setUserId(response.id);
        }
      } catch (error) {
        console.error("사용자 정보 요청 중 오류 발생:", error);
        alert("사용자 정보를 가져오는데 실패했습니다.");
        navigate("/login");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (isPaymentStarted && timeLeft !== null) {
      // 결제가 시작된 경우에만 타이머 작동
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      if (timeLeft === 0) {
        handleCancelPayment();
      }

      return () => clearInterval(timer);
    }
  }, [timeLeft, isPaymentStarted]);

  useEffect(() => {
    const loadProductData = async () => {
      const productData = await getProductByDetailId(productDetailId);
      const detailData = await getProductDetail(productDetailId);

      setProduct(productData);
      setProductDetail(detailData);
    };

    if (productDetailId) loadProductData();
  }, [productDetailId]);

  const handlePayment = async () => {
    if (!product || !productDetail) {
      alert("상품 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const orderData = { userId, productDetailId, price: selectedSeats.length * product.price, selectedSeats };
    const orderResponse = await createOrder(orderData);

    if (!orderResponse) {
      alert("해당 좌석은 이미 선택되었습니다.");
      navigate(`/seat-selection/${productDetailId}`);
      return;
    }

    setOrderId(orderResponse.orderId);

    // initiatePayment 함수 호출하여 결제 진행
    initiatePayment(orderResponse.orderId, product, selectedSeats, paymentMethod, navigate);

    // 결제창이 열린 후 타이머 시작
    setIsPaymentStarted(true);
    setTimeLeft(1 * 10);
  };

  const handleCancelPayment = async () => {
    await cancelOrder(orderId);
    alert("5분이 지나 결제가 자동으로 취소되었습니다. 좌석을 다시 선택해주세요.");

    if (window.IMP) {
      window.IMP.close();
    }

    navigate(`/seat-selection/${productDetailId}`);
  };


    return (
        <div className="payment-page">
            <h2>🎟 예매</h2>
          {product && <PaymentInfo product={product} productDetail={productDetail} selectedSeats={selectedSeats} />}

            <label className="payment-label">결제 방법 선택</label>
            <select
                className="payment-method-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
            >
                <option value="card">신용카드</option>
                <option value="kakaopay">카카오페이</option>
                <option value="naverpay">네이버페이</option>
            </select>

            {isPaymentStarted && (
                <p className="payment-timer">
                    남은 결제 시간: {Math.floor(timeLeft / 60)}분 {timeLeft % 60}초
                </p>
            )}

            <button className="payment-submit-button" onClick={handlePayment}>
                결제하기
            </button>
        </div>
    );

};

export default PaymentPage;
