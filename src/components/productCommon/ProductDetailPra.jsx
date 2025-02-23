import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../../api/productApi";
import ProductDetailCommon from "../productCommon/ProductDetailCommon";

function ProductDetailPra() {
    const { id } = useParams();
    const [productData, setProductData] = useState({});
    const [productDetails, setProductDetails] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedProductDetailId, setSelectedProductDetailId] = useState(null);
    const [remain, setRemain] = useState();

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProduct(id);
            setProductData(data);
            setProductDetails(data.productDetails);
        };
        fetchProduct();
    }, [id]);

    return (
        <ProductDetailCommon
            productData={productData}
            productDetails={productDetails}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            handleTimeSelect={setSelectedProductDetailId}
            selectedProductDetailId={selectedProductDetailId}
            remain={remain}
        />
    );
}

export default ProductDetailPra;
