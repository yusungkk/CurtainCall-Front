import React, {useEffect} from "react";

const BookingSummary = ({ selectedSeats }) => {
    useEffect(() => {
        console.log("선택한 좌석이 업데이트됨:", selectedSeats);
    }, [selectedSeats]);

    return (
        <div className="selected-seats">
            <h3>🪑 선택한 좌석</h3>
            {selectedSeats.length === 0 ? (
                <p>선택된 좌석이 없습니다.</p>
            ) : (
                <ul className="seatUl">
                    {selectedSeats.map((seat, index) => (
                        <p key={index}>{seat}</p>  // 선택한 좌석을 화면에 출력
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BookingSummary;
