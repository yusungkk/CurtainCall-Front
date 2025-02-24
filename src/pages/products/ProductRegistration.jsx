import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CREATE_PRODUCT_URL } from "../../utils/endpoint";
import "./ProductRegistration.css";

const ProductRegistration = () => {
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [place, setPlace] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [runningTime, setRunningTime] = useState("");
  const [price, setPrice] = useState("");
  const [casting, setCasting] = useState("");
  const [notice, setNotice] = useState("");
  const [productDetails, setProductDetails] = useState([]);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [childCategories, setChildCategories] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/categories", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCategories(data);
          const filteredCategories = data.filter((category) => category.parentId === null);
          setParentCategories(filteredCategories);
        } else {
          throw new Error(await response.json());
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchCategory();
  }, []);

  const addProductDetail = () => {
    setProductDetails([...productDetails, { date: "", time: "", remain: "" }]);
  };

  const removeProductDetail = (index) => {
    setProductDetails(productDetails.filter((_, i) => i !== index));
  };

  const updateProductDetail = (index, field, value) => {
    const updatedDetails = [...productDetails];
    updatedDetails[index][field] = value;
    setProductDetails(updatedDetails);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleParentCategoryChange = (e) => {
    const parentId = parseInt(e.target.value, 10);
    setSelectedParentId(parentId);

    const filteredChildCategories = categories.filter((category) => category.parentId === parentId);
    setChildCategories(filteredChildCategories);
  };

  const handleChildCategoryChange = (e) => {
    const childId = parseInt(e.target.value, 10);
    setCategoryId(childId);
  };

  // 유효성 검사
  const validateForm = () => {
    let newErrors = {};

    if (!productName.trim()) newErrors.productName = "상품명을 입력하세요.";
    if (!categoryId) newErrors.categoryId = "2차 카테고리를 선택하세요.";
    if (!place.trim()) newErrors.place = "장소를 입력하세요.";
    if (!startDate) newErrors.startDate = "시작 날짜를 선택하세요.";
    if (!endDate) newErrors.endDate = "종료 날짜를 선택하세요.";
    if (!runningTime) newErrors.runningTime = "러닝타임을 입력하세요.";
    if (!price) newErrors.price = "가격을 입력하세요.";
    if (!casting.trim()) newErrors.casting = "캐스팅을 입력하세요.";
    if (!notice.trim()) newErrors.notice = "공지사항을 입력하세요.";
    if (!image) newErrors.image = "이미지를 업로드하세요.";
    if (productDetails.length === 0)
      newErrors.productDetails = "최소 하나의 공연 일정을 추가하세요.";

    // 공연 일정 유효성 검사
    productDetails.forEach((detail, index) => {
      if (!detail.date) newErrors[`date${index}`] = "요일을 선택하세요.";
      if (!detail.time) newErrors[`time${index}`] = "시간을 선택하세요.";
      if (!detail.remain) newErrors[`remain${index}`] = "잔여 좌석을 입력하세요.";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const productData = {
      productName,
      categoryId,
      place,
      startDate,
      endDate,
      runningTime,
      price,
      casting,
      notice,
      productDetails,
    };

    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(productData)], {
        type: "application/json",
      })
    );
    formData.append("image", image);

    try {
      const response = await fetch(CREATE_PRODUCT_URL, {
        method: "POST",
        body: formData,
      });

      if (response.status === 201) {
        alert("상품이 등록되었습니다!");
        navigate("/admin/products");
      } else {
        throw new Error(await response.json());
      }
    } catch (error) {
      console.error("상품 등록 실패:", error);
      alert("상품 등록에 실패했습니다.");
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h2>🎭 상품 등록</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>상품명</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          {errors.productName && <p className="error">{errors.productName}</p>}

          <div className="input-group">
            <label>장르</label>
            <div className="category-group">
              <select onChange={handleParentCategoryChange}>
                <option value="">1차 카테고리</option>
                {parentCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select onChange={handleChildCategoryChange}>
                <option value="">2차 카테고리</option>
                {childCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.categoryId && <p className="error">{errors.categoryId}</p>}

          <div className="input-group">
            <label>장소</label>
            <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} />
          </div>
          {errors.place && <p className="error">{errors.place}</p>}

          <div className="input-group">
            <label>시작 날짜</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          {errors.startDate && <p className="error">{errors.startDate}</p>}

          <div className="input-group">
            <label>종료 날짜</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          {errors.endDate && <p className="error">{errors.endDate}</p>}

          <div className="input-group">
            <label>러닝타임 (분)</label>
            <input
              type="number"
              value={runningTime}
              onChange={(e) => setRunningTime(e.target.value)}
            />
          </div>
          {errors.runningTime && <p className="error">{errors.runningTime}</p>}

          <div className="input-group">
            <label>가격 (원)</label>
            <input
              type="number"
              placeholder="가격 (원)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          {errors.price && <p className="error">{errors.price}</p>}

          <div className="input-group">
            <label>캐스팅</label>
            <input type="text" value={casting} onChange={(e) => setCasting(e.target.value)} />
          </div>
          {errors.casting && <p className="error">{errors.casting}</p>}

          <div className="input-group">
            <label>공지사항</label>
            <textarea
              placeholder="500자 내외"
              rows="5"
              cols="50"
              value={notice}
              onChange={(e) => setNotice(e.target.value)}
            />
          </div>
          {errors.notice && <p className="error">{errors.notice}</p>}

          <h3>📅 공연 일정</h3>
          {productDetails.map((detail, index) => (
            <div key={index} className="schedule-group">
              <select
                value={detail.date}
                onChange={(e) => updateProductDetail(index, "date", e.target.value)}
              >
                <option value="">요일 선택</option>
                <option value="월">월</option>
                <option value="화">화</option>
                <option value="수">수</option>
                <option value="목">목</option>
                <option value="금">금</option>
                <option value="토">토</option>
                <option value="일">일</option>
              </select>

              <select
                value={detail.time}
                onChange={(e) => updateProductDetail(index, "time", e.target.value)}
              >
                <option value="">시간 선택</option>
                {[...Array(24).keys()].map((hour) => (
                  <option key={hour} value={`HOUR_${hour.toString().padStart(2, "0")}_00`}>
                    {`${hour.toString().padStart(2, "0")}:00`}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="잔여 좌석"
                value={detail.remain}
                onChange={(e) => updateProductDetail(index, "remain", e.target.value)}
              />
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeProductDetail(index)}
              >
                ❌{" "}
              </button>
            </div>
          ))}
          {errors.productDetails && <p className="error">{errors.productDetails}</p>}

          <button type="button" onClick={addProductDetail} className="add-btn">
            + 일정 추가
          </button>

          <h3>🖼️ 이미지 업로드</h3>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {errors.image && <p className="error">{errors.image}</p>}

          <button type="submit" className="submit-btn">
            상품 등록
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductRegistration;
