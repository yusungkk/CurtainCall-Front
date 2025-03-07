import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSearchProduct } from "/src/api/productApi";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import "/src/pages/products/SearchResult.css";

const SearchResult = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("keyword") || "";
    const [searchKeyword, setSearchKeyword] = useState(keyword);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const fetchSearchResult = async (page, size) => {
        try {
            const response = await getSearchProduct(searchKeyword, page, size);
            setProducts(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchSearchResult(currentPage, 5);
    }, [searchKeyword, currentPage]);

    useEffect(() => {
        setSearchKeyword(keyword);
    }, [keyword]);

    return (
        <div class="search-result-container">
            <div className="search-result-header">
                <div className="product-search-title">검색 결과</div>
                <div className="result-count">{`(${totalElements})`}</div>
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

export default SearchResult;
