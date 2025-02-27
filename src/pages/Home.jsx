import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SpecialProductList from "/src/components/specialProduct/SpcialProductList.jsx";
import ProductList from "/src/components/products/ProductList.jsx";
import ProductGrid from "/src/components/products/ProductGrid.jsx";

import {
    recommendedProductsByCategory,
    recommendedProductsBySequence,
} from "/src/api/productApi.js";

const Home = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryName = queryParams.get("genre") || "all";

    const [recommendedProducts, setRecommendedProducts] = useState([]); // 추천 상품 리스트
    const [chainRecommendedProducts, setChainRecommendedProducts] = useState([]); // 추천 상품 리스트

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
        <div className="home-container">
            <ProductList genre={categoryName} />
            <SpecialProductList /> {/* 특가 상품 리스트 호출 */}
            <ProductGrid
                title="자주 클릭하신 장르의 인기 작품이에요!"
                products={recommendedProducts}
            />
            <ProductGrid
                title="당신을 위한 취향 저격 리스트!"
                products={chainRecommendedProducts}
            />
        </div>
    );
};

export default Home;
