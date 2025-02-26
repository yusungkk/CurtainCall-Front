import { Link } from "react-router-dom";
import "/src/components/products/ProductList.css";

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
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
    );
};

export default ProductCard;
