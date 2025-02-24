import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/orders/PaymentPage.css";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { productDetailId, selectedSeats } = location.state || {
    productDetailId: null,
    selectedSeats: [],
  };
  const [timeLeft, setTimeLeft] = useState(null); // 타이머 시작 전까지는 null
  const [isPaymentStarted, setIsPaymentStarted] = useState(false); // 결제 시작 여부
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    alert(
      "*** 주의: 결제하기 버튼을 누르신 후 5분 안에 결제가 완료되지 않으면 결제가 자동으로 취소되니 유의 바랍니다. ***\n(선택하신 좌석도 해제됩니다.)"
    );
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

  console.log("현재 productDetailId:", productDetailId);

  const [product, setProduct] = useState(null);
  const [productDetail, setProductDetail] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card"); // 기본 결제 방법 설정

  useEffect(() => {
    // 상품 정보 가져오기
    axios
      .get(`http://localhost:8080/api/v1/products/detail/${productDetailId}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error("상품 정보 로드 실패:", error));
  }, [productDetailId]);

  useEffect(() => {
    // 상품 세부 정보 가져오기
    axios
      .get(`http://localhost:8080/api/v1/products/details/${productDetailId}`)
      .then((response) => setProductDetail(response.data))
      .catch((error) => console.error("상품 세부 정보 로드 실패:", error));
  }, [productDetailId]);

  const handlePayment = async () => {
    if (!product || !productDetail) {
      alert("상품 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    // 초기 주문은 PENDING 상태로 생성
    const orderData = {
      userId: 1, // 임시 userId
      productDetailId: Number(productDetailId),
      price: selectedSeats.length * product.price,
      selectedSeats,
    };

    try {
      const response = await axios.post("http://localhost:8080/api/orders/create", orderData);

      console.log("주문 생성 완료 (PENDING 상태):", response.data.orderId);
      setOrderId(response.data.orderId);
      initiatePayment(response.data.orderId);
    } catch (error) {
      console.error("주문 생성 실패:", error);
      if (error.response && error.response.status === 400) {
        alert("해당 좌석은 이미 선택되었습니다. 다른 좌석으로 다시 시도해주세요."); // 예약된 좌석 알림
      } else {
        alert("주문 생성에 실패했습니다.");
      }
      navigate(`/seat-selection/${productDetailId}`, { state: { productDetailId } });
      return;
    }
  };

  const initiatePayment = (orderId) => {
    const { IMP } = window;
    IMP.init("imp67361044"); // 포트원 가맹점 식별 코드 (고정)

    IMP.request_pay(
      {
        pg: "html5_inicis", // 고정
        pay_method: paymentMethod,
        merchant_uid: `order_${orderId}`,
        name: product.productName,
        amount: selectedSeats.length * product.price,
        buyer_email: "test@example.com",
        buyer_name: "홍길동",
      },
      async (rsp) => {
        // 결제 성공시
        if (rsp.success) {
          const paymentData = {
            paymentNo: rsp.imp_uid,
            payStatus: rsp.status,
            price: rsp.paid_amount,
            cardName: rsp.card_name,
            orderId: orderId,
          };

          // 결제 정보 저장
          try {
            const response = await fetch("http://localhost:8080/api/v1/payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(paymentData),
            });

            if (response.status === 201) {
              try {
                await axios.put(`http://localhost:8080/api/orders/${orderId}/complete`);
                alert("결제 성공! 주문이 완료되었습니다.");
                navigate("/confirmation", { state: { orderId } });
              } catch (error) {
                console.error("주문 상태 업데이트 실패:", error);
                alert("결제는 성공했지만 주문 상태를 업데이트하는 중 오류가 발생했습니다.");
              }
            }
          } catch (error) {
            console.log("결제 중 오류가 발생했습니다", error);
          }
        } else {
          console.error("결제 실패:", rsp);
          try {
            await axios.put(`http://localhost:8080/api/orders/${orderId}/fail`);
            alert(`결제 실패: ${rsp.error_msg}`);
          } catch (error) {
            console.error("주문 실패 상태 업데이트 오류:", error);
          }
        }
      }
    );

    // 결제창이 열린 후 타이머 시작
    setIsPaymentStarted(true);
    setTimeLeft(5 * 60); // n분
  };

  const handleCancelPayment = async () => {
    alert("5분이 지나 결제가 자동으로 취소되었습니다. 좌석을 다시 선택해주세요.");

    if (window.IMP) {
      window.IMP.close();
    }

    try {
      await axios.post(`http://localhost:8080/api/orders/${orderId}/cancel`);
    } catch (error) {
      console.error("주문 취소 실패:", error);
    }
    navigate(`/seat-selection/${productDetailId}`, { state: { productDetailId } });
  };


    return (
        <div className="payment-page">
            <h2>🎟 예매</h2>
            <div className="payment-product-info">
                {product ? (
                    <>
                        <img
                            className="payment-product-image"
                            src={product.productImageUrl}
                            alt={product.productName}
                        />
                        <table className="payment-info-table">
                            <tbody>
                            <tr>
                                <td className="payment-info-title">제목</td>
                                <td>{product.productName}</td>
                            </tr>
                            <tr>
                                <td className="payment-info-title">장소</td>
                                <td>{product.place}</td>
                            </tr>
                            <tr>
                                <td className="payment-info-title">날짜</td>
                                <td>{productDetail.performanceDate}</td>
                            </tr>
                            <tr>
                                <td className="payment-info-title">시간</td>
                                <td>{productDetail.time}</td>
                            </tr>
                            <tr>
                                <td className="payment-info-title">좌석</td>
                                <td>
                                    {selectedSeats.length > 0
                                        ? selectedSeats.join(", ")
                                        : "선택된 좌석 없음"}
                                </td>
                            </tr>
                            <tr>
                                <td className="payment-info-title">가격</td>
                                <td>{selectedSeats.length * product.price}원</td>
                            </tr>
                            </tbody>
                        </table>
                    </>
                ) : (
                    <p>상품 정보를 불러오는 중...</p>
                )}
            </div>

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
