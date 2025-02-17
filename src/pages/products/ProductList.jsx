import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../styles/products/productList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 상품 목록 가져오기
    axios
      .get("http://localhost:8080/api/v1/products")
      .then((response) => {
        setProducts(response.data.content);
      })
      .catch((error) => {
        console.error("상품 목록을 불러오는 중 오류 발생:", error);
      });
  }, []);

  return (
    <div className="product-list-container">
      <h2>🎭 상품 조회 페이지</h2>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.productId} className="product-card">
            <Link to={`/products/${product.productId}`}>
              <img
                src={product.productImageUrl}
                alt={product.productName}
                className="product-image"
              />

              <h3 className="product-title">{product.productName}</h3>

              <p className="product-place">{product.place}</p>

              <p className="product-dates">
                {product.startDate} ~ {product.endDate}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
