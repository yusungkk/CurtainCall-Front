import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import { format } from "date-fns";
import "react-calendar/dist/Calendar.css";
import "../../styles/products/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const url = `http://localhost:8080/api/products/${id}`;

  const [productName, setProductName] = useState();
  const [place, setPlace] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [runningTime, setRunningTime] = useState();
  const [price, setPrice] = useState();
  const [productDetails, setProductDetails] = useState([]);
  const [casting, setCasting] = useState();
  const [notice, setNotice] = useState();
  const [imageUrl, setImageUrl] = useState();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProductDetailId, setSelectedProductDetailId] = useState(null);

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setProductName(response.data.productName);
        setPlace(response.data.place);
        setStartDate(response.data.startDate);
        setEndDate(response.data.endDate);
        setRunningTime(response.data.runningTime);
        setPrice(response.data.price);
        setProductDetails(response.data.productDetails);
        setCasting(response.data.casting);
        setNotice(response.data.notice);
        setImageUrl(response.data.productImageUrl);
      })
      .catch((error) => {
        console.log("상품 정보를 불러오는 중 오류 발생:", error);
      });
  }, []);

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  const handleSelectTime = (id) => {
    setSelectedProductDetailId(id);
    alert(`상품 상세 id: ${id}`);
  };

  // 선택한 날짜의 상품 상세
  const getSelectedProductDetails = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return productDetails
      .filter((productDetail) => productDetail.performanceDate === dateStr) // 선택한 날짜와 일치하는 상품 상세 필터링
      .sort((a, b) => a.time.localeCompare(b.time)); // 시간 순 정렬
  };

  // 공연 날짜만 활성화
  const tileDisabled = ({ date, view }) => {
    // 월별 뷰에서만
    if (view === "month") {
      const dateStr = format(date, "yyyy-MM-dd");
      return !productDetails.some(
        (productDetail) => productDetail.performanceDate === dateStr
      );
    }
    return false;
  };

  // 달력 타일 커스텀
  const tileContent = ({ date }) => {
    return <div>{date.getDate()}</div>;
  };

  return (
    <div>
      <div>
        <Calendar
          onChange={handleSelectDate}
          value={selectedDate}
          calendarType="gregory"
          minDate={new Date(startDate)}
          maxDate={new Date(endDate)}
          tileContent={tileContent}
          tileDisabled={tileDisabled}
          prev2Label={null}
          next2Label={null}
          showNeighboringMonth={false}
        />
        <div>
          <p>선택한 날짜: {format(selectedDate, "yyyy-MM-dd")}</p>
          <p>공연 시간</p>
          {getSelectedProductDetails(selectedDate).map((productDetail) => (
            <button
              key={productDetail.productDetailId}
              onClick={() => handleSelectTime(productDetail.productDetailId)}
            >
              {productDetail.time}
            </button>
          ))}
        </div>
        <div>
          <button>예매하기</button>
        </div>
      </div>
      <div>
        <div>
          <h2>{productName}</h2>
        </div>
        <div>
          <img src={imageUrl} />
        </div>
        <div>
          <div>
            <table>
              <tbody>
                <tr>
                  <th>장소</th>
                  <td>{place}</td>
                </tr>
                <tr>
                  <th>공연기간</th>
                  <td>
                    {startDate} ~ {endDate}
                  </td>
                </tr>
                <tr>
                  <th>공연시간</th>
                  <td>{runningTime}분</td>
                </tr>
                <tr>
                  <th>가격</th>
                  <td>{price}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3>공연정보</h3>
          <div>
            <h4>캐스팅</h4>
            <span>{casting}</span>
          </div>
          <div>
            <h4>공지사항</h4>
            <span>{notice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
