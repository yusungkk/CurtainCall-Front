const PaymentInfo = ({ product, productDetail, selectedSeats }) => {
    return (
        <div className="payment-product-info">
            <img
                className="payment-product-image"
                src={product.productImageUrl}
                alt={product.productName}
            />
            <table className="payment-info-table">
                <tbody>
                <tr><td className="payment-info-title">제목</td><td>{product.productName}</td></tr>
                <tr><td className="payment-info-title">장소</td><td>{product.place}</td></tr>
                <tr><td className="payment-info-title">날짜</td><td>{productDetail.performanceDate}</td></tr>
                <tr><td className="payment-info-title">시간</td><td>{productDetail.time}</td></tr>
                <tr><td className="payment-info-title">좌석</td><td>{selectedSeats.join(", ") || "선택된 좌석 없음"}</td></tr>
                <tr><td className="payment-info-title">가격</td><td>{selectedSeats.length * product.price}원</td></tr>
                </tbody>
            </table>
        </div>
    );
};

export default PaymentInfo;
