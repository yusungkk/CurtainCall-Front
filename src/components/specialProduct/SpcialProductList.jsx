import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ACTIVE_SPECIAL_PRODUCT_URL } from "../../utils/endpoint";
// import "C:/Users/User/Desktop/curtainCall/backstage-front/src/pages/products/productList.css";
import  "./SpecialProductList.css";
import "/src/pages/products/productList.css";
import "./SpecialProductList.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SpecialProductList = () => {
    const [specialProducts, setSpecialProducts] = useState([]);

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

    // 할인된 가격 계산 함수
    const getDiscountedPrice = (price, discountRate) => {
        return price - Math.floor((price * discountRate) / 100);
    };

    // 🟢 React Slick 설정 (5개씩 슬라이드)
    const settings = {
        dots: true, // 밑에 페이지네이션 점 표시
        infinite: true, // 무한 반복
        speed: 500,
        slidesToShow: 5, // 한 번에 5개 표시
        slidesToScroll: 5, // 5개씩 이동
        arrows: true, // 좌우 화살표 표시
        responsive: [
            {
                breakpoint: 1024, // 태블릿
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 768, // 모바일
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 480, // 작은 모바일
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className="product-list-container">
            <h1 className="discount-title">지금 할인중!</h1>

            {/* 🟢 React Slick 캐러셀 적용 */}
            <Slider {...settings}>
                {specialProducts.map((specialProductDto) => (
                    <div key={specialProductDto.productId} className="product-card">
                        <Link to={`/products/${specialProductDto.productId}`}>
                            <img
                                src={specialProductDto.imageUrl}
                                alt={specialProductDto.productName}
                                className="product-image"
                            />
                            <h3 className="product-title" title={specialProductDto.productName}>
                                {specialProductDto.productName}
                            </h3>
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
            </Slider>
        </div>
    );
};

export default SpecialProductList;
