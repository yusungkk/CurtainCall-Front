import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../../api/productApi";
import { UPDATE_PRODUCT_URL } from "../../utils/endpoint";

function ProductEditForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [productName, setProductName] = useState("");
  const [place, setPlace] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [runningTime, setRunningTime] = useState("");
  const [price, setPrice] = useState("");
  const [casting, setCasting] = useState("");
  const [notice, setNotice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);

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
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // 상품 수정 API 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      productName,
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
        <p>
          <input
            type="text"
            placeholder="상품명"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          ></input>
        </p>
        <p>
          <input
            type="text"
            placeholder="장소"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            required
          ></input>
        </p>
        <p>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          ></input>
        </p>
        <p>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          ></input>
        </p>
        <p>
          <input
            type="number"
            placeholder="러닝타임 (분)"
            value={runningTime}
            onChange={(e) => setRunningTime(e.target.value)}
            required
          ></input>
        </p>
        <p>
          <input
            type="number"
            placeholder="가격 (원)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          ></input>
        </p>
        <p>
          <input
            type="text"
            placeholder="캐스팅"
            value={casting}
            onChange={(e) => setCasting(e.target.value)}
          />
        </p>

        <p>
          <textarea
            placeholder="공지사항"
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
            rows="5"
            cols="50"
          ></textarea>
        </p>

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
