import React, { useState } from "react";
import SeatSelection from "../../components/orders/SeatSelection.jsx";
import ProductInfo from "../../components/orders/ProductInfo.jsx";
import BookingSummary from "../../components/orders/BookingSummary.jsx";
import "../../styles/orders/BookingPage.css";
import {useParams} from "react-router-dom";

const BookingPage = () => {
    const { productDetailId } = useParams();
    const [selectedSeats, setSelectedSeats] = useState([]);

    return (
        <div className="booking-page">
            <div className="seat-section">
                <SeatSelection productDetailId={productDetailId} onSeatSelect={setSelectedSeats} />
            </div>
            <div className="info-section">
                <ProductInfo productDetailId={productDetailId} />
                <BookingSummary selectedSeats={selectedSeats} />
            </div>
        </div>
    );
};

export default BookingPage;
