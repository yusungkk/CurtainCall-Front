import React, { useState } from "react";
import SeatSelection from "../../components/orders/SeatSelection.jsx";
import ProductInfo from "../../components/orders/ProductInfo.jsx";
import BookingSummary from "../../components/orders/BookingSummary.jsx";
import "./BookingPage.css";
import {useNavigate, useParams} from "react-router-dom";

const BookingPage = () => {
    const navigate = useNavigate();
    const { productDetailId } = useParams();
    const [selectedSeats, setSelectedSeats] = useState([]);

    // 결제 페이지로 이동
    const handleSeatSelectionComplete = () => {
        if (selectedSeats.length === 0) {
            alert("좌석을 선택해주세요!");
            return;
        }

        navigate(`/payment`, { state: { productDetailId, selectedSeats } }); // 선택한 좌석 정보 전달
    };

    return (
        <div className="booking-page">
            <div className="seat-section">
                <SeatSelection productDetailId={productDetailId} onSeatSelect={setSelectedSeats} />
            </div>
            <div className="info-section">
                <ProductInfo productDetailId={productDetailId} />
                <BookingSummary selectedSeats={selectedSeats} />
                <button className="confirm-btn" onClick={handleSeatSelectionComplete}>
                    좌석 선택 완료
                </button>
            </div>
        </div>
    );
};

export default BookingPage;
