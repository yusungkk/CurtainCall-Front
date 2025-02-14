import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductInfo = ({ productDetailId }) => {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/products/detail/${productDetailId}`)
            .then(response => setProduct(response.data))
            .catch(error => console.error("상품 정보 로드 실패:", error));
    }, [productDetailId]);

    if (!product) return <p>상품 정보를 불러오는 중...</p>;

    return (
        <div className="product-info">
            <img src={product.productImageUrl} alt={product.productName} className="product-image" />
            <h3>{product.productName}</h3>
            <p>{product.place}</p>
            <p>{product.startDate} ~ {product.endDate}</p>
        </div>
    );
};

export default ProductInfo;
