import { useState } from "react";
import axios from "axios";

const ProductRegistration = () => {
    const [productName, setProductName] = useState("");
    const [place, setPlace] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [runningTime, setRunningTime] = useState("");
    const [price, setPrice] = useState("");
    const [casting, setCasting] = useState("");
    const [notice, setNotice] = useState("");
    const [productDetails, setProductDetails] = useState([]);
    const [image, setImage] = useState(null);

    // 상품 상세 추가
    const addProductDetail = () => {
        setProductDetails([...productDetails, { date: "", time: "", remain: "" }]);
    };

    // 상품 상세 수정
    const updateProductDetail = (index, field, value) => {
        const updatedDetails = [...productDetails];
        updatedDetails[index][field] = value;
        setProductDetails(updatedDetails);
    };

    // 이미지 파일 선택 핸들러
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    // ENUM 변환 함수 (한글 -> 영문)
    const convertDateToEnum = (date) => {
        const dateMap = {
            "월": "MONDAY",
            "화": "TUESDAY",
            "수": "WEDNESDAY",
            "목": "THURSDAY",
            "금": "FRIDAY",
            "토": "SATURDAY",
            "일": "SUNDAY"
        };
        return dateMap[date] || date;  // 변환 실패 시 그대로 반환
    };

    // 상품 등록 API 요청
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            alert("이미지를 선택해주세요!");
            return;
        }

        // 🔹 데이터 변환: 한글 요일을 ENUM 값으로 변환
        const formattedProductDetails = productDetails.map(detail => ({
            date:detail.date,
            time: detail.time,  // 시간은 ENUM 값으로 전송
            remain: parseInt(detail.remain, 10)
        }));

        const productData = {
            productName,
            place,
            startDate,
            endDate,
            runningTime: parseInt(runningTime, 10),
            price: parseInt(price, 10),
            casting,
            notice,
            productDetails: formattedProductDetails
        };

        console.log("📌 전송할 데이터:", JSON.stringify(productData, null, 2));  // 🚀 API 요청 전 확인

        const formData = new FormData();
        formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));
        formData.append("image", image);

        try {
            const response = await axios.post("http://localhost:8080/api/products/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("✅ 상품이 등록되었습니다!");
            console.log(response.data);
        } catch (error) {
            console.error("🚨 상품 등록 실패:", error);
            alert("상품 등록에 실패했습니다.");
        }
    };

    return (
        <div>
            <h2>상품 등록</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="상품명" value={productName} onChange={(e) => setProductName(e.target.value)} required />
                <input type="text" placeholder="장소" value={place} onChange={(e) => setPlace(e.target.value)} required />
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                <input type="number" placeholder="러닝타임 (분)" value={runningTime} onChange={(e) => setRunningTime(e.target.value)} required />
                <input type="number" placeholder="가격 (원)" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <input type="text" placeholder="캐스팅" value={casting} onChange={(e) => setCasting(e.target.value)} />
                <textarea placeholder="공지사항" value={notice} onChange={(e) => setNotice(e.target.value)} />

                <h3>공연 일정</h3>
                {productDetails.map((detail, index) => (
                    <div key={index}>
                        <select value={detail.date} onChange={(e) => updateProductDetail(index, "date", e.target.value)}>
                            <option value="">요일 선택</option>
                            <option value="월">월</option>
                            <option value="화">화</option>
                            <option value="수">수</option>
                            <option value="목">목</option>
                            <option value="금">금</option>
                            <option value="토">토</option>
                            <option value="일">일</option>
                        </select>
                        <select value={detail.time} onChange={(e) => updateProductDetail(index, "time", e.target.value)}>
                            <option value="">시간 선택</option>
                            {[...Array(24).keys()].map((hour) => (
                                <option key={hour} value={`HOUR_${hour.toString().padStart(2, "0")}_00`}>
                                    {`${hour.toString().padStart(2, "0")}:00`}
                                </option>
                            ))}
                        </select>
                        <input type="number" placeholder="잔여 좌석" value={detail.remain} onChange={(e) => updateProductDetail(index, "remain", e.target.value)} />
                    </div>
                ))}
                <button type="button" onClick={addProductDetail}>+</button>

                <h3>이미지 업로드</h3>
                <input type="file" accept="image/*" onChange={handleImageChange} required />

                <button type="submit">상품 등록</button>
            </form>
        </div>
    );
};

export default ProductRegistration;
