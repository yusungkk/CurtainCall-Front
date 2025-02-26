import { useLocation } from "react-router-dom";
import SpecialProductList from "/src/components/specialProduct/SpcialProductList.jsx";
import ProductList from "/src/pages/products/ProductList.jsx";

const Home = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryName = queryParams.get("genre") || "all";

    return (
        <div className="home-container">
            <ProductList genre={categoryName} />
            <SpecialProductList /> {/* 특가 상품 리스트 호출 */}
        </div>
    );
};

export default Home;
