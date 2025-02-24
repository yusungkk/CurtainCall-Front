import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PRODUCT_URL, RECOMMEND_URL } from "/src/utils/endpoint";
import "/src/pages/products/ProductList.css";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [recommendedProducts, setRecommendedProducts] = useState([]); // 추천 상품 리스트
    const [chainRecommendedProducts, setChainRecommendedProducts] = useState([]); // 추천 상품 리스트

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(PRODUCT_URL, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setProducts(data.content);
                } else {
                    throw new Error(await response.json());
                }
            } catch (e) {
                console.log(e);
            }
        };

        fetchProducts();
    }, []);

    // ✅ 사용자 추천 상품 가져오기
    useEffect(() => {
        const fetchRecommendedProducts = async () => {
            try {
                const response = await fetch(`${RECOMMEND_URL}/click`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setRecommendedProducts(data);
                } else {
                    throw new Error(await response.json());
                }
            } catch (e) {
                console.log(e);
            }
        };

        fetchRecommendedProducts();
    }, []);

    // ✅ 연쇄 상품
    useEffect(() => {
        const fetchChainRecommendedProducts = async () => {
            try {
                const response = await fetch(`${RECOMMEND_URL}/chain`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setChainRecommendedProducts(data);
                } else {
                    throw new Error(await response.json());
                }
            } catch (e) {
                console.log(e);
            }
        };

        fetchChainRecommendedProducts();
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

            {/* ✅ 사용자 추천 상품 */}
            {recommendedProducts.length > 0 && (
                <>
                    <h2>🔥 자주 클릭하신 장르의 인기 작품이에요! </h2>
                    <div className="product-grid">
                        {recommendedProducts.map((product) => (
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
                </>
            )}



            {/* ✅ 사용자 추천 상품 */}
            {chainRecommendedProducts.length > 0 && (
                <>
                    <h2>🔥 다른 이용자들이 연속적으로 클릭한 상품을 추천해드려요! </h2>
                    <div className="product-grid">
                        {chainRecommendedProducts.map((product) => (
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
                </>
            )}


        </div>
    );
};

export default ProductList;
