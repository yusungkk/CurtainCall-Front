import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActiveSpecialProducts } from '../../api/specialProductApi';
import "./SpecialProductList.css";
import "/src/pages/products/productList.css";

const SpecialProductList = () => {
    const [specialProducts, setSpecialProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchSpecialProducts = async () => {
            try {
                const data = await getActiveSpecialProducts();
                setSpecialProducts(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSpecialProducts();
    }, []);

    // Pagination 계산
    const totalPages = Math.ceil(specialProducts.length / itemsPerPage);
    const displayedProducts = specialProducts.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    // 할인된 가격 계산
    const getDiscountedPrice = (price, discountRate) => {
        return price - Math.floor((price * discountRate) / 100);
    };

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
            <h1 className="product-list-title">지금 할인중!</h1>

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

                            <p className="product-discount">
                                <span className="specialProduct-rate">{specialProductDto.discountRate}%</span>
                                <span className="specialProduct-price">
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
