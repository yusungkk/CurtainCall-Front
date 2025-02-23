import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ACTIVE_SPECIAL_PRODUCT_URL } from "../../utils/endpoint";
import "C:/Users/User/Desktop/curtainCall/backstage-front/src/pages/products/productList.css";
import  "./SpecialProductList.css";

const SpecialProductList = () => {
    const [specialProducts, setSpecialProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchSpecialProducts = async () => {
            try {
                const response = await fetch(ACTIVE_SPECIAL_PRODUCT_URL, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setSpecialProducts(data);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Error fetching specialProducts");
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchSpecialProducts();
    }, []);

    // 페이지네이션 계산
    const totalPages = Math.ceil(specialProducts.length / itemsPerPage);
    const displayedProducts = specialProducts.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    // 할인된 가격 계산 함수
    const getDiscountedPrice = (price, discountRate) => {
        return price - Math.floor((price * discountRate) / 100);
    };

    // 페이지 이동 핸들러
    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return (
        <div className="product-list-container">
            <h1 className="discount-title">지금 할인중!</h1>

            <div className="product-grid">
                {displayedProducts.map((specialProductDto) => (
                    <div key={specialProductDto.productId} className="product-card">
                        <Link to={`/products/${specialProductDto.productId}`}>
                            <img
                                src={specialProductDto.imageUrl}
                                alt={specialProductDto.productName}
                                className="product-image"
                            />
                            <h3 className="product-title">{specialProductDto.productName}</h3>
                            <p className="product-place">{specialProductDto.place}</p>
                            <p className="product-dates">
                                {specialProductDto.discountStartDate} ~ {specialProductDto.discountEndDate}
                            </p>
                            {/* 할인율, 할인가 표시 부분 */}
                            <p className="product-discount">
                                <span className="discount-rate">{specialProductDto.discountRate}%</span>
                                <span className="discount-price">
                                    {getDiscountedPrice(specialProductDto.price, specialProductDto.discountRate).toLocaleString()}원
                                </span>
                            </p>

                        </Link>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 0}>
                    &#8592; 이전
                </button>
                <span>
                    {currentPage + 1} / {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
                    다음 &#8594;
                </button>
            </div>
        </div>
    );
};

export default SpecialProductList;
