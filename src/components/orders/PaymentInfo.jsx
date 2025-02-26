const PaymentInfo = ({ product, productDetail, selectedSeats, discountRate, finalPrice }) => {
    return (
        <div className="payment-container">
            <div className="payment-image-container">
                <img
                    className="payment-product-image"
                    src={product.productImageUrl}
                    alt={product.productName}
                />
            </div>

            <div className="payment-details">
                <table className="payment-info-table">
                    <tbody>
                    <tr><td className="payment-info-title">제목</td><td>{product.productName}</td></tr>
                    <tr><td className="payment-info-title">장소</td><td>{product.place}</td></tr>
                    <tr><td className="payment-info-title">날짜</td><td>{productDetail.performanceDate}</td></tr>
                    <tr><td className="payment-info-title">시간</td><td>{productDetail.time}</td></tr>
                    <tr><td className="payment-info-title">좌석</td><td>{selectedSeats.join(", ") || "선택된 좌석 없음"}</td></tr>
                    <tr>
                        <td className="payment-info-title">가격</td>
                        <td>
                            {finalPrice !== product.price
                                ? `${(finalPrice * selectedSeats.length).toLocaleString()}원 (${discountRate}% 할인 적용)`
                                : `${(product.price * selectedSeats.length).toLocaleString()}원`}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentInfo;
