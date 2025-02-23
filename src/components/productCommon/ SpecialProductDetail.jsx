import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import { format } from "date-fns";
import "C:/Users/User/Desktop/curtainCall/backstage-front/src/pages/products/ProductDetail.css";
import "C:/Users/User/Desktop/curtainCall/backstage-front/src/pages/products/CustomCalendar.css";

// 공연 상세 정보 API 호출 함수
const fetchProductDetails = async (productId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/products/detail/${productId}`, {
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch product details");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching product details:", error);
        return [];
    }
};

function SpecialProductDetail({ specialProductDto }) {
    const { id } = useParams(); // URL에서 상품 ID 가져오기
    const [productDetails, setProductDetails] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedProductDetailId, setSelectedProductDetailId] = useState(null);
    const [remain, setRemain] = useState();

    useEffect(() => {
        if (id) {
            fetchProductDetails(id).then(setProductDetails);
        }
    }, [id]);

    const handleTimeSelect = (id, remain) => {
        setSelectedProductDetailId(id);
        setRemain(remain);
    };

    // 선택한 날짜의 상품 상세
    const getSelectedProductDetails = (date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        return productDetails
            .filter((productDetail) => productDetail.performanceDate === dateStr)
            .sort((a, b) => a.time.localeCompare(b.time)); // 시간순 정렬
    };

    const tileClassName = ({ date }) => {
        return date.getDay() === 6 ? "saturday" : "";
    };

    // 날짜 비활성화
    const tileDisabled = ({ date, view }) => {
        if (view === "month") {
            const dateStr = format(date, "yyyy-MM-dd");
            const todayStr = format(new Date(), "yyyy-MM-dd");
            return !productDetails.some(
                (productDetail) => productDetail.performanceDate === dateStr && dateStr > todayStr
            );
        }
        return false;
    };

    return (
        <div className="product-container">
            <div className="product-main">
                <div className="product-main-top">
                    <div className="summary">
                        <div className="summary-top">
                            <h2>{specialProductDto.productName}</h2>
                        </div>
                        <div className="summary-body">
                            <div className="poster-box">
                                <img src={specialProductDto.imageUrl} alt="공연 포스터" />
                            </div>
                            <ul className="info">
                                <li className="info-item">
                                    <strong className="info-label">장소</strong>
                                    <p className="info-text">{specialProductDto.place}</p>
                                </li>
                                <li className="info-item">
                                    <strong className="info-label">공연기간</strong>
                                    <p className="info-text">
                                        {specialProductDto.startDate} ~ {specialProductDto.endDate}
                                    </p>
                                </li>
                                <li className="info-item">
                                    <strong className="info-label">공연시간</strong>
                                    <p className="info-text">{specialProductDto.runningTime}분</p>
                                </li>
                                <li className="info-item">
                                    <strong className="info-label">가격</strong>
                                    <p className="info-text">
                                        {specialProductDto.price.toLocaleString()}원
                                    </p>
                                </li>
                                <li className="info-item">
                                    <strong className="info-label">할인가</strong>
                                    <p className="info-text">
                                        {(
                                            specialProductDto.price *
                                            (1 - specialProductDto.discountRate / 100)
                                        ).toLocaleString()}
                                        원
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="product-main-body">
                    <div className="casting-container">
                        <h3 className="casting-header">캐스팅</h3>
                        <p className="casting-content">{specialProductDto.casting}</p>
                    </div>
                    <div className="notice-container">
                        <h3 className="notice-header">공지사항</h3>
                        <div className="notice-content">
                            {specialProductDto.notice.split("\n").map((line, index) =>
                                line.trim() === "" ? <br key={index} /> : <div key={index}>{line}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-side">
                <div className="side-wrapper">
                    <div className="side-main">
                        <div className="container-top">
                            <div className="side-header">
                                <h4 className="side-title">관람일</h4>
                            </div>
                            <div className="side-calendar">
                                <Calendar
                                    onChange={setSelectedDate}
                                    value={selectedDate}
                                    formatDay={(locale, date) => format(date, "d")}
                                    formatYear={(locale, date) => format(date, "yyyy")}
                                    formatMonthYear={(locale, date) => format(date, "yyyy. MM")}
                                    calendarType="gregory"
                                    minDate={new Date(specialProductDto.startDate)}
                                    maxDate={new Date(specialProductDto.endDate)}
                                    tileClassName={tileClassName}
                                    tileDisabled={tileDisabled}
                                    prev2Label={null}
                                    next2Label={null}
                                    showNeighboringMonth={false}
                                    minDetail="month"
                                />
                            </div>
                        </div>
                        <div className="container-bottom">
                            <div className="side-header">
                                <h4 className="side-title">공연 시간</h4>
                            </div>
                            <div className="time-selection">
                                {getSelectedProductDetails(selectedDate).map((productDetail) => (
                                    <button
                                        className={`time-btn ${
                                            productDetail.productDetailId === selectedProductDetailId
                                                ? "selected"
                                                : ""
                                        }`}
                                        key={productDetail.productDetailId}
                                        onClick={() =>
                                            handleTimeSelect(
                                                productDetail.productDetailId,
                                                productDetail.remain
                                            )
                                        }
                                    >
                                        {productDetail.time}
                                    </button>
                                ))}
                            </div>
                            <div className="seat-remain">
                                <h4 className="remain-title">잔여석</h4>
                                <span className="remain-value">{remain}</span>
                            </div>
                        </div>
                    </div>

                    <div className="side-btn">
                        <button>예매하기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpecialProductDetail;
