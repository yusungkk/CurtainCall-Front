import SpecialProductList from "../components/specialProduct/SpcialProductList.jsx";

const Home = () => {
    return (
        <div className="home-container">
            <SpecialProductList /> {/* 특가 상품 리스트 호출 */}
        </div>
    );
};

export default Home;