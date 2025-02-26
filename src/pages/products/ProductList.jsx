import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetcher } from "/src/utils/fetcher";
import { PRODUCT_URL, RECOMMEND_URL } from "/src/utils/endpoint";
import ProductGrid from "/src/components/products/ProductGrid";
import "/src/pages/products/ProductList.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
    recommendedProductsByCategory,
    recommendedProductsBySequence,
} from "../../api/productApi.js";

const ProductList = ({ genre }) => {
    let url;
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [recommendedProducts, setRecommendedProducts] = useState([]); // 추천 상품 리스트
    const [chainRecommendedProducts, setChainRecommendedProducts] = useState([]); // 추천 상품 리스트
    const [category, setCategory] = useState(genre);

    useEffect(() => {
        setCategory(genre);
        setCurrentPage(0);
    }, [genre]);

    const getProducts = async (page, size) => {
        url = `${PRODUCT_URL}/search?genre=${genre}&page=${page}&size=${size}`;

        const response = await fetcher(url);
        setProducts(response.content);
        setTotalPages(response.totalPages);
    };

    useEffect(() => {
        getProducts(currentPage, 10);
    }, [category, currentPage]);

    useEffect(() => {
        const loadRecommendedProductsByCategory = async () => {
            const data = await recommendedProductsByCategory();
            if (data) setRecommendedProducts(data);
        };

        const loadRecommendedProductsBySequence = async () => {
            const data = await recommendedProductsBySequence();
            if (data) setChainRecommendedProducts(data);
        };

        loadRecommendedProductsByCategory();
        loadRecommendedProductsBySequence();
    }, []);

    return (
        <div className="product-list-container">
            <div className="product-list-header">
                <h1 className="product-list-title">
                    {genre === "all" ? "전체" : category} 둘러보기
                </h1>
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

            <ProductGrid
                title="🔥 자주 클릭하신 장르의 인기 작품이에요!"
                products={recommendedProducts}
            />
            <ProductGrid
                title="🔥 다른 이용자들이 연속적으로 클릭한 상품을 추천해드려요!"
                products={chainRecommendedProducts}
            />
        </div>
    );
};

export default ProductList;
