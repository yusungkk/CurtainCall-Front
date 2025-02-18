import {useLocation, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/orders/PaymentPage.css";

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { productDetailId, selectedSeats } = location.state || { productDetailId: null, selectedSeats: [] };

    console.log("✅ 현재 productDetailId:", productDetailId);

    const [product, setProduct] = useState(null);
    const [productDetail, setProductDetail] = useState(null);

    useEffect(() => {   // 상품 정보
        axios.get(`http://localhost:8080/api/products/detail/${productDetailId}`)
            .then(response => setProduct(response.data))
            .catch(error => console.error("상품 정보 로드 실패:", error));
    }, [productDetailId]);

    useEffect(() => {   // 상품 세부 정보
        axios.get(`http://localhost:8080/api/products/details/${productDetailId}`)
            .then(response => setProductDetail(response.data))
            .catch(error => console.error("상품 세부 정보 로드 실패:", error));
    }, [productDetailId]);

    const handlePayment = async () => {
        const orderData = {
            userId: 1,  // 임시 userId
            // productDetailId,
            productDetailId: Number(productDetailId),
            price: selectedSeats.length * product.price,
            selectedSeats
        };

        console.log("주문 데이터:", orderData);

        try {
            const response = await axios.post("http://localhost:8080/api/orders/create", orderData);
            alert("결제 페이지로 넘어갑니다.");
            navigate("/confirmation", { state: { order: response.data } });
        } catch (error) {
            console.error("결제 실패:", error);
            alert("결제 시도에 실패했습니다.");
        }
    };

    return (
        <div className="payment-page">
            <h2>🎟 예매</h2>
            <div className="product-info">
                {/* ✅ 상품 이미지 */}
                {product ? (
                    <>
                        <img src={product.productImageUrl} alt={product.productName} />
                        <table>
                            <tbody>
                            <tr>
                                <td>제목</td>
                                <td>{product.productName}</td>
                            </tr>
                            <tr>
                                <td>장소</td>
                                <td>{product.place}</td>
                            </tr>
                            <tr>
                                <td>날짜</td>
                                <td>{productDetail.performanceDate}</td>
                            </tr>
                            <tr>
                                <td>시간</td>
                                <td>{productDetail.time}</td>
                            </tr>
                            <tr>
                                <td>러닝 타임</td>
                                <td>{product.runningTime + "분"}</td>
                            </tr>
                            <tr>
                                <td>좌석</td>
                                <td>{selectedSeats.length > 0 ? selectedSeats.join(", ") : "선택된 좌석 없음"}</td>
                            </tr>
                            <tr>
                                <td>가격</td>
                                <td>{selectedSeats.length * product.price}원</td>
                            </tr>
                            </tbody>
                        </table>
                    </>
                ) : (
                    <p>상품 정보를 불러오는 중...</p>
                )}
            </div>

            <select className="payment-method">
                <option value="card">신용카드</option>
                <option value="kakaopay">카카오페이</option>
                <option value="naverpay">네이버페이</option>
            </select>

            <button onClick={handlePayment}>결제하기</button>
        </div>
    );
};

export default PaymentPage;
