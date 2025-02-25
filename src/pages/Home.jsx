import SpecialProductList from "/src/components/specialProduct/SpcialProductList.jsx";
import ProductList from "/src/pages/products/ProductList.jsx";

const Home = () => {
    return (
        <div className="home-container">
            <ProductList />
            <SpecialProductList /> {/* 특가 상품 리스트 호출 */}
        </div>
    );
};

export default Home;
