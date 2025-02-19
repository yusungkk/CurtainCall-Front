import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PRODUCT_URL } from "../../utils/endpoint";
import "./ProductList.css";

const ProductList = () => {
    const [products, setProducts] = useState([]);

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

                            <h3 className="product-title">
                                {product.productName}
                            </h3>

                            <p className="product-place">{product.place}</p>

                            <p className="product-dates">
                                {product.startDate} ~ {product.endDate}
                            </p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
