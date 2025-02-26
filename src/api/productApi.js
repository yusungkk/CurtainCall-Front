import { fetcher } from "/src/utils/fetcher";
import { PRODUCT_URL, DELETE_PRODUCT_URL, CREATE_PRODUCT_URL
, RECOMMEND_URL, PRODUCT_BY_DETAILID_URL, PRODUCT_DETAILS_URL} from "/src/utils/endpoint";

export const getProduct = async (id) => {
    const URL = `${PRODUCT_URL}/${id}`;
    return await fetcher(URL, {
        credentials: 'include',
    });
};

export const deleteProduct = async (id) => {
    return fetcher(DELETE_PRODUCT_URL(id), {
        method: "DELETE",
    });
};

export const createProduct = async (productData, image) => {
    const formData = new FormData();
    formData.append(
        "product",
        new Blob([JSON.stringify(productData)], {
            type: "application/json"
        })
    );
    formData.append("image", image);

    return await fetcher(CREATE_PRODUCT_URL, {
        method: "POST",
        body: formData,
    });
};

// 전체 상품 목록 조회
export const getProducts = async () => {
    return await fetcher(PRODUCT_URL);
};

// 사용자 클릭 기반 추천 상품 조회
export const recommendedProductsByCategory = async () => {
    return await fetcher(`${RECOMMEND_URL}/click`);
};

// 연쇄 상품 추천 조회
export const recommendedProductsBySequence = async () => {
    return await fetcher(`${RECOMMEND_URL}/chain`);
};

// 상품 상세 ID로 상품 조회
export const getProductByDetailId = async (productDetailId) => {
    return await fetcher(`${PRODUCT_BY_DETAILID_URL}/${productDetailId}`);
};

// 상품 상세 ID로 상품 상세 조회
export const getProductDetail = async (productDetailId) => {
    return await fetcher(`${PRODUCT_DETAILS_URL}/${productDetailId}`);
};
