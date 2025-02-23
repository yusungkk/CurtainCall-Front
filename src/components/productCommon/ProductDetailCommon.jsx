import Calendar from "react-calendar";
import { format } from "date-fns";
import "C:/Users/User/Desktop/curtainCall/backstage-front/src/pages/products/ProductDetail.css";
import "C:/Users/User/Desktop/curtainCall/backstage-front/src/pages/products/CustomCalendar.css";

const ProductDetailCommon = ({
                                 productData,
                                 productDetails,
                                 selectedDate,
                                 setSelectedDate,
                                 handleTimeSelect,
                                 selectedProductDetailId,
                                 remain,
                             }) => {
    const getSelectedProductDetails = (date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        return productDetails
            .filter((detail) => detail.performanceDate === dateStr)
            .sort((a, b) => a.time.localeCompare(b.time));
    };

    const tileClassName = ({ date }) => (date.getDay() === 6 ? "saturday" : "");

    const tileDisabled = ({ date, view }) => {
        if (view === "month") {
            const dateStr = format(date, "yyyy-MM-dd");
            const todayStr = format(new Date(), "yyyy-MM-dd");
            return !productDetails.some(
                (detail) => detail.performanceDate === dateStr && dateStr > todayStr
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
                            <h2>{productData.productName}</h2>
                        </div>
                        <div className="summary-body">
                            <div className="poster-box">
                                <img src={productData.imageUrl} alt={productData.productName} />
                            </div>
                            <ul className="info">
                                <li className="info-item">
                                    <strong className="info-label">장소</strong>
                                    <p className="info-text">{productData.place}</p>
                                </li>
                                <li className="info-item">
                                    <strong className="info-label">공연기간</strong>
                                    <p className="info-text">
                                        {productData.startDate} ~ {productData.endDate}
                                    </p>
                                </li>
                                <li className="info-item">
                                    <strong className="info-label">공연시간</strong>
                                    <p className="info-text">{productData.runningTime}분</p>
                                </li>
                                <li className="info-item">
                                    <strong className="info-label">가격</strong>
                                    <p className="info-text">{productData.price.toLocaleString()}원</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="product-main-body">
                    <div className="casting-container">
                        <h3 className="casting-header">캐스팅</h3>
                        <p className="casting-content">{productData.casting}</p>
                    </div>
                    <div className="notice-container">
                        <h3 className="notice-header">공지사항</h3>
                        <div className="notice-content">{productData.notice}</div>
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
                                    minDate={new Date(productData.startDate)}
                                    maxDate={new Date(productData.endDate)}
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
                                {getSelectedProductDetails(selectedDate).map((detail) => (
                                    <button
                                        className={`time-btn ${
                                            detail.productDetailId === selectedProductDetailId ? "selected" : ""
                                        }`}
                                        key={detail.productDetailId}
                                        onClick={() => handleTimeSelect(detail.productDetailId, detail.remain)}
                                    >
                                        {detail.time}
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
};

export default ProductDetailCommon;
