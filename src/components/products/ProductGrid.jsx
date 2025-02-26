import ProductCard from "./ProductCard";
import "/src/components/products/ProductList.css";

const ProductGrid = ({ title, products }) => {
    return (
        <>
            {products.length > 0 && (
                <div className="product-list-container">
                    <h1 className="product-list-title">
                        <img src="/src/assets/hot.png"></img>
                        {title}
                    </h1>
                    <div className="product-list-body">
                        <div className="product-grid">
                            {products.map((product) => (
                                <ProductCard key={product.productId} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductGrid;
