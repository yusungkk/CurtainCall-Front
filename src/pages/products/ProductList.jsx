import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetcher } from "/src/utils/fetcher";
import { PRODUCT_URL } from "/src/utils/endpoint";
import "/src/pages/products/ProductList.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ProductList = ({ genre }) => {
    let url;
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
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
        </div>
    );
};

export default ProductList;
