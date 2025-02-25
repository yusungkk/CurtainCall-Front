import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetcher } from "/src/utils/fetcher";
import { PRODUCT_URL, RECOMMEND_URL } from "/src/utils/endpoint";
import "/src/pages/products/ProductList.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ProductList = () => {
    let url;
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [recommendedProducts, setRecommendedProducts] = useState([]); // 추천 상품 리스트
    const [chainRecommendedProducts, setChainRecommendedProducts] = useState([]); // 추천 상품 리스트

    const getProducts = async (page, size) => {
        url = `${PRODUCT_URL}?page=${page}&size=${size}`;

        const response = await fetcher(url);
        setProducts(response.content);
        setTotalPages(response.totalPages);
    };

    useEffect(() => {
        getProducts(currentPage, 10);
    }, [currentPage]);

    // ✅ 사용자 추천 상품 가져오기
    useEffect(() => {
        const fetchRecommendedProducts = async () => {
            try {
                const response = await fetch(`${RECOMMEND_URL}/click`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
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
                    credentials: "include",
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
            <div className="product-list-header">
                <h1 className="product-list-title">지금 상영중!</h1>
            </div>

            <div className="product-list-body">
                {currentPage > 0 && (
                    <button onClick={() => setCurrentPage(currentPage - 1)}>
                        <ArrowBackIosNewIcon />
                    </button>
                )}

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
                {currentPage < totalPages - 1 && (
                    <button onClick={() => setCurrentPage(currentPage + 1)}>
                        <ArrowForwardIosIcon />
                    </button>
                )}
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
