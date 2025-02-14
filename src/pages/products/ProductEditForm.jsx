import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ProductEditForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const url = `http://localhost:8080/api/products/${id}`;

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
    axios.get(url).then((response) => {
      setProductName(response.data.productName);
      setPlace(response.data.place);
      setStartDate(response.data.startDate);
      setEndDate(response.data.endDate);
      setRunningTime(response.data.runningTime);
      setPrice(response.data.price);
      setCasting(response.data.casting);
      setNotice(response.data.notice);
      setImageUrl(response.data.productImageUrl);
    });
  }, []);

  function handleImageChange(e) {
    setImage(e.target.files[0]);
  }

  // 상품 수정 API 요청
  async function handleSubmit(e) {
    e.preventDefault();

    const productData = {
      productName,
      place,
      startDate,
      endDate,
      runningTime,
      price: parseInt(price, 10),
      casting,
      notice,
    };

    console.log("📌 전송할 데이터:", JSON.stringify(productData, null, 2)); // 🚀 API 요청 전 확인

    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(productData)], { type: "application/json" })
    );
    formData.append("image", image);

    try {
      const response = await axios.patch(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ 상품이 수정되었습니다!");

      navigate("/admin/products");
    } catch (error) {
      console.error("🚨 상품 수정 실패:", error);
      alert("상품 수정에 실패했습니다.");
    }
  }

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
