import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ProductManagement() {
  const url = "http://localhost:8080/api/products";
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(url).then((response) => {
      console.log(response.data); // 받아온 상품 목록 데이터
      setProducts(response.data);
    });
  }, []);

  return (
    <div>
      <h2>상품 관리</h2>
      <main>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>포스터</th>
              <th>제목</th>
              <th>장소</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productId}>
                <td>{product.productId}</td>
                <td>
                  <img
                    src={product.productImageUrl} // S3 accessdenied
                    alt={product.productName}
                  ></img>
                </td>
                <td>{product.productName}</td>
                <td>{product.place}</td>
                <td>
                  <Link to={`/admin/products/${product.productId}/edit`}>
                    <button>수정</button>
                  </Link>
                </td>
                <td>
                  <button>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default ProductManagement;
