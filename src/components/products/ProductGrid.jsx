import ProductCard from "./ProductCard";
import "/src/pages/products/ProductList.css";

const ProductGrid = ({ title, products }) => {
    return (
        <>
            {products.length > 0 && (
                <>
                    <h2>{title}</h2>
                    <div className="product-grid">
                        {products.map((product) => (
                            <ProductCard key={product.productId} product={product} />
                        ))}
                    </div>
                </>
            )}
        </>
    );
};

export default ProductGrid;
