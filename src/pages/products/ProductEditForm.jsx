import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../../api/productApi";
import { UPDATE_PRODUCT_URL } from "../../utils/endpoint";

function ProductEditForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState();
  const [place, setPlace] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [runningTime, setRunningTime] = useState("");
  const [price, setPrice] = useState("");
  const [casting, setCasting] = useState("");
  const [notice, setNotice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [childCategories, setChildCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProduct(id);

      setProductName(data.productName);
      setPlace(data.place);
      setStartDate(data.startDate);
      setEndDate(data.endDate);
      setRunningTime(data.runningTime);
      setPrice(data.price);
      setCasting(data.casting);
      setNotice(data.notice);
      setImageUrl(data.productImageUrl);
    };

    fetchProduct();

    const fetchCategory = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/categories", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCategories(data);

          setParentCategories(data.filter((category) => category.parentId === null));
        } else {
          throw new Error(await response.json());
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchCategory();
  }, []);

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

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

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
      const response = await fetch(UPDATE_PRODUCT_URL(id), {
        method: "PATCH",
        body: formData,
      });

      if (response.status === 204) {
        alert("✅ 상품이 수정되었습니다!");
        navigate("/admin/products");
      } else {
        throw new Error(await response.json());
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <h2>상품 수정</h2>
      <form onSubmit={handleSubmit}>
        <div>{imageUrl && <img src={imageUrl} alt="image-preview"></img>}</div>
        <div>
          <label>상품명</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          ></input>
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
        <div>
          <label>장소</label>
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            required
          ></input>
        </div>
        {errors.place && <p className="error">{errors.place}</p>}
        <div>
          <label>시작 날짜</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          ></input>
        </div>
        {errors.startDate && <p className="error">{errors.startDate}</p>}
        <div>
          <label>종료 날짜</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          ></input>
        </div>
        {errors.endDate && <p className="error">{errors.endDate}</p>}
        <div>
          <label>러닝타임 (분)</label>
          <input
            type="number"
            value={runningTime}
            onChange={(e) => setRunningTime(e.target.value)}
            required
          ></input>
        </div>
        {errors.runningTime && <p className="error">{errors.runningTime}</p>}
        <div>
          <label>가격 (원)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          ></input>
        </div>
        {errors.price && <p className="error">{errors.price}</p>}
        <div>
          <label>캐스팅</label>
          <input type="text" value={casting} onChange={(e) => setCasting(e.target.value)} />
        </div>
        {errors.casting && <p className="error">{errors.casting}</p>}
        <div>
          <label>공지사항</label>
          <textarea
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
            rows="5"
            cols="50"
          ></textarea>
        </div>
        {errors.notice && <p className="error">{errors.notice}</p>}

        <h3>포스터 수정</h3>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <button type="submit">수정</button>
        <button
          type="button"
          onClick={() => {
            navigate("/admin/products");
          }}
        >
          취소
        </button>
      </form>
    </div>
  );
}

export default ProductEditForm;
