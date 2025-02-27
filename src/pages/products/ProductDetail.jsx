import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../../api/productApi";
import { getUserData } from "/src/api/userApi.js";
import Calendar from "react-calendar";
import { format } from "date-fns";
import "/src/pages/products/ProductDetail.css";
import "/src/pages/products/CustomCalendar.css";

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        productName: null,
        place: null,
        startDate: null,
        endDate: null,
        runningTime: 0,
        price: 0,
        productDetails: [],
        casting: null,
        formattedNotice: null,
        remain: 0,
        imageUrl: null,
        discountRate: 0,
        discountStartDate: null,
        discountEndDate: null,
    });

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedProductDetailId, setSelectedProductDetailId] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProduct(id);

            setProduct((prev) => ({
                ...prev,
                productName: data.productName,
                place: data.place,
                startDate: data.startDate,
                endDate: data.endDate,
                runningTime: data.runningTime,
                price: data.price,
                productDetails: data.productDetails,
                casting: data.casting,
                formattedNotice: data.notice
                    .split("\n")
                    .map((line, index) =>
                        line === "" || line === " " ? (
                            <br key={index}></br>
                        ) : (
                            <div key={index}>{line}</div>
                        )
                    ),
                remain: data.remain,
                imageUrl: data.productImageUrl,
                discountRate: data.discountRate,
                discountStartDate: data.discountStartDate,
                discountEndDate: data.discountEndDate,
            }));
        };

        fetchProduct();
    }, []);

    const handleTimeSelect = (id, remain) => {
        setSelectedProductDetailId(id);
        setProduct((prev) => ({
            ...prev,
            remain: remain,
        }));
    };

    const handleValid = async (e) => {
        try {
            const response = await getUserData();

            if (response === 403) {
                navigate("/login", { state: { from: `/products/${id}` } });
                return;
            }
        } catch (error) {
            console.error("사용자 정보 요청 중 오류 발생:", error);
            return;
        }

        if (selectedProductDetailId === null) {
            alert("관람 시간을 선택해주세요!");
            return;
        }

        navigate(`/seat-selection/${selectedProductDetailId}`);
    };

    // 선택한 날짜의 상품 상세
    const getSelectedProductDetails = (date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        return product.productDetails
            .filter((productDetail) => productDetail.performanceDate === dateStr) // 선택한 날짜와 일치하는 상품 상세 필터링
            .sort((a, b) => a.time.localeCompare(b.time)); // 시간 순 정렬
    };

    const tileClassName = ({ date }) => {
        if (date.getDay() === 6) {
            return "saturday";
        }

        return "";
    };

    // 날짜 비활성화
    const tileDisabled = ({ date, view }) => {
        // 월별 뷰에서만
        if (view === "month") {
            // 지나지 않은 공연 날짜 활성화
            const dateStr = format(date, "yyyy-MM-dd"); // 선택 날짜
            const todayStr = format(new Date(), "yyyy-MM-dd"); // 오늘 날짜
            return !product.productDetails.some(
                (productDetail) => productDetail.performanceDate === dateStr && dateStr >= todayStr
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
                            <h2>{product.productName}</h2>
                        </div>
                        <div className="summary-body">
                            <div className="poster-box">
                                <img src={product.imageUrl} />
                            </div>
                            <ul className="info">
                                <li className="info-item">
                                    <strong className="info-label">장소</strong>
                                    <p className="info-text">{product.place}</p>
                                </li>
                                <li className="info-item">
                                    <strong className="info-label">공연기간</strong>
                                    <p className="info-text">
                                        {product.startDate} ~ {product.endDate}
                                    </p>
                                </li>
                                <li className="info-item">
                                    <strong className="info-label">공연시간</strong>
                                    <p className="info-text">{product.runningTime}분</p>
                                </li>
                                <li className="info-item">
                                    <strong className="info-label">가격</strong>
                                    {product.discountRate > 0 ? (
                                        <div className="info-text">
                                            <span className="original-price">
                                                {product.price.toLocaleString("ko-KR")}원
                                            </span>
                                            <span className="discount-price">
                                                {Math.round(
                                                    product.price * (1 - product.discountRate / 100)
                                                ).toLocaleString("ko-KR")}
                                                원
                                            </span>
                                            <span className="discount-rate">
                                                ({product.discountRate}% 할인)
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="info-text">
                                            {product.price.toLocaleString("ko-KR")}원
                                        </p>
                                    )}
                                </li>
                                {product.discountRate > 0 && (
                                    <li className="info-item">
                                        <strong className="info-label discount-label">
                                            할인기간
                                        </strong>
                                        <p className="info-text discount-period">
                                            {format(
                                                new Date(product.discountStartDate),
                                                "yyyy-MM-dd"
                                            )}{" "}
                                            ~{" "}
                                            {format(
                                                new Date(product.discountEndDate),
                                                "yyyy-MM-dd"
                                            )}
                                        </p>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="product-main-body">
                    <div className="casting-container">
                        <h3 className="casting-header">캐스팅</h3>
                        <p className="casting-content">{product.casting}</p>
                    </div>
                    <div className="notice-container">
                        <h3 className="notice-header">공지사항</h3>
                        <div className="notice-content">{product.formattedNotice}</div>
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
                                    onChange={(date) => {
                                        setSelectedDate(date);
                                    }}
                                    value={selectedDate}
                                    formatDay={(locale, date) => format(date, "d")}
                                    formatYear={(locale, date) => format(date, "yyyy")}
                                    formatMonthYear={(locale, date) => format(date, "yyyy. MM")}
                                    calendarType="gregory"
                                    minDate={new Date()}
                                    maxDate={new Date(product.endDate)}
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
                                            productDetail.productDetailId ===
                                            selectedProductDetailId
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
                                <span className="remain-value">{product.remain}</span>
                            </div>
                        </div>
                    </div>

                    <div className="side-btn">
                        <button onClick={handleValid}>예매하기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
