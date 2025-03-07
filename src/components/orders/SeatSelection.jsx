import React, { useState, useEffect } from "react";
import "../../pages/orders/SeatSelection.css";
import {getReservedSeats} from "../../api/orderApi.js";

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const SEAT_LAYOUT = [3, 8, 3]; // 좌석 배치 (3 | 8 | 3)

const SeatSelection = ({ productDetailId, onSeatSelect }) => {
    const [reservedSeats, setReservedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    // 예약된 좌석 불러오기
    useEffect(() => {
        window.scrollTo(0, 0); // 페이지 로드 시 화면을 맨 위로 스크롤

        const loadReservedSeats = async () => {
            const data = await getReservedSeats(productDetailId);
            if (data) setReservedSeats(data);
        };

        loadReservedSeats();
    }, [productDetailId]);

    // 좌석 선택 핸들러
    const handleSeatClick = (seat) => {
        if (reservedSeats.includes(seat)) return; // 예약된 좌석 클릭 방지

        const updatedSeats = selectedSeats.includes(seat)
            ? selectedSeats.filter(s => s !== seat)
            : [...selectedSeats, seat];

        setSelectedSeats([...updatedSeats]); // 새 배열을 생성해서 상태 업데이트

        console.log("선택된 좌석:", selectedSeats);

        onSeatSelect([...updatedSeats]); // 부모 컴포넌트로 업데이트된 좌석 전달
    };

    // 선택된 좌석 상태 업데이트 확인
    useEffect(() => {
        console.log("업데이트된 선택된 좌석 목록:", selectedSeats);
    }, [selectedSeats]);

    return (
        <div className="seat-selection-container">
            <h2>🎭 좌석 선택</h2>
            <div className="screen">STAGE</div>
            <div className="seats">
                {ROWS.map((row) => (
                    <div key={row} className="seat-row">
                        {SEAT_LAYOUT.flatMap((count, index) => {
                            let startIndex = index === 0 ? 1 : index === 1 ? 4 : 12; // 그룹별 시작 번호 설정

                            const seats = Array.from({ length: count }, (_, i) => {
                                const seatNum = `${row}${String(startIndex + i).padStart(2, "0")}`; // 좌석 번호 설정
                                return (
                                    <button
                                        key={seatNum}
                                        className={`seat ${reservedSeats.includes(seatNum) ? "reserved" : ""}
                                                     ${selectedSeats.includes(seatNum) ? "selected" : ""}`}
                                        onClick={() => handleSeatClick(seatNum)}
                                        disabled={reservedSeats.includes(seatNum)}
                                    >
                                        {seatNum}
                                    </button>
                                );
                            });

                            return index === 1
                                ? [<div key={`gap-${row}`} className="seat-gap"></div>, ...seats, <div key={`gap-${row}-end`} className="seat-gap"></div>]
                                : seats;
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeatSelection;
