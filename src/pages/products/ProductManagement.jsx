import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ProductManagement() {
  const url = "http://localhost:8080/api/v1/products";
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const getProducts = async (page, size) => {
    const response = await axios.get(`${url}?page=${page}&size=${size}`);
    setProducts(response.data.content);
    setTotalPages(response.data.page.totalPages);
  };

  useEffect(() => {
    getProducts(currentPage, 10);
  }, [currentPage]);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  async function handleProductDelete(productId) {
    try {
      const response = await axios.delete(`${url}/${productId}`);

      const updatedProducts = products.filter(
        (product) => product.productId !== productId
      );
      setProducts(updatedProducts);

      alert("상품이 삭제되었습니다");
    } catch (error) {
      alert("상품 삭제 중 오류가 발생했습니다");
    }
  }

  return (
    <div>
      <h2>상품 관리</h2>
      <main>
        <div>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            이전
          </button>
          {getPageNumbers().map((page) => (
            <button key={page} onClick={() => setCurrentPage(page - 1)}>
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            다음
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>포스터</th>
              <th>제목</th>
              <th>장소</th>
              <th>시작일</th>
              <th>종료일</th>
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
                    src={product.productImageUrl}
                    alt={product.productName}
                    style={{ width: "100px" }}
                  ></img>
                </td>
                <td>{product.productName}</td>
                <td>{product.place}</td>
                <td>{product.startDate}</td>
                <td>{product.endDate}</td>
                <td>
                  <Link to={`/admin/products/${product.productId}/edit`}>
                    <button>수정</button>
                  </Link>
                </td>
                <td>
                  <button
                    onClick={() => {
                      if (window.confirm("정말 상품을 삭제하시겠습니까?")) {
                        handleProductDelete(product.productId);
                      }
                    }}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Link to="/register">
          <button>상품 등록</button>
        </Link>
      </main>
    </div>
  );
}

export default ProductManagement;
