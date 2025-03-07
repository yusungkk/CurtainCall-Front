import React, { useEffect, useState } from "react";
import {getProductByDetailId} from "../../api/productApi.js";

const ProductInfo = ({ productDetailId }) => {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const loadProduct = async () => {
            const data = await getProductByDetailId(productDetailId);
            if (data) setProduct(data);
        };

        loadProduct();
    }, [productDetailId]);

  if (!product) return <p>상품 정보를 불러오는 중...</p>;

  return (
    <div className="product-info">
      <img src={product.productImageUrl} alt={product.productName} className="product-image" />
      <h3>{product.productName}</h3>
      <p>{product.place}</p>
      <p>
        {product.startDate} ~ {product.endDate}
      </p>
    </div>
  );
};

export default ProductInfo;
