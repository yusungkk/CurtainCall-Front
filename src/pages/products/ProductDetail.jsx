import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../../api/productApi";
import Calendar from "react-calendar";
import { format } from "date-fns";
import "./ProductDetail.css";
import "./CustomCalendar.css";

function ProductDetail() {
  const { id } = useParams();

  const [productName, setProductName] = useState();
  const [place, setPlace] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [runningTime, setRunningTime] = useState();
  const [price, setPrice] = useState();
  const [productDetails, setProductDetails] = useState([]);
  const [casting, setCasting] = useState();
  const [formattedNotice, setFormattedNtice] = useState();
  const [remain, setRemain] = useState();
  const [imageUrl, setImageUrl] = useState();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProductDetailId, setSelectedProductDetailId] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProduct(id);

      setProductName(data.productName);
      setPlace(data.place);
      setStartDate(data.startDate);
      setEndDate(data.endDate);
      setRunningTime(data.runningTime);
      setPrice(data.price);
      setProductDetails(data.productDetails);
      setCasting(data.casting);
      setFormattedNtice(
        data.notice
          .split("\n")
          .map((line, index) =>
            line === "" || line === " " ? <br key={index}></br> : <div key={index}>{line}</div>
          )
      );
      setImageUrl(data.productImageUrl);
    };

    fetchProduct();
  }, []);

  const handleTimeSelect = (id, remain) => {
    setSelectedProductDetailId(id);
    setRemain(remain);
  };

  // 선택한 날짜의 상품 상세
  const getSelectedProductDetails = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return productDetails
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
              <h2>{productName}</h2>
            </div>
            <div className="summary-body">
              <div className="poster-box">
                <img src={imageUrl} />
              </div>
              <ul className="info">
                <li className="info-item">
                  <strong className="info-label">장소</strong>
                  <p className="info-text">{place}</p>
                </li>
                <li className="info-item">
                  <strong className="info-label">공연기간</strong>
                  <p className="info-text">
                    {startDate} ~ {endDate}
                  </p>
                </li>
                <li className="info-item">
                  <strong className="info-label">공연시간</strong>
                  <p className="info-text">{runningTime}분</p>
                </li>
                <li className="info-item">
                  <strong className="info-label">가격</strong>
                  <p className="info-text">{price}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="product-main-body">
          <div className="casting-container">
            <h3 className="casting-header">캐스팅</h3>
            <p className="casting-content">{casting}</p>
          </div>
          <div className="notice-container">
            <h3 className="notice-header">공지사항</h3>
            <div className="notice-content">{formattedNotice}</div>
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
                  minDate={new Date(startDate)}
                  maxDate={new Date(endDate)}
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
                      productDetail.productDetailId === selectedProductDetailId ? "selected" : ""
                    }`}
                    key={productDetail.productDetailId}
                    onClick={() =>
                      handleTimeSelect(productDetail.productDetailId, productDetail.remain)
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

export default ProductDetail;
