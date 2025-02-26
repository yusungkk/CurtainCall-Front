import { fetcher } from "/src/utils/fetcher";
import {ACTIVE_SPECIAL_PRODUCT_URL, SEARCH_PRODUCTS_URL, SPECIAL_PRODUCT_URL} from "/src/utils/endpoint";


//삭제되지 않은 특가상품 조회
export const getActiveSpecialProducts = async () => {
    return await fetcher(ACTIVE_SPECIAL_PRODUCT_URL);
};

//특가상품 페이지네이션 및 검색
export const getSpecialProducts = async (currentPage, searchKeyword = '') => {
    let url = `${SPECIAL_PRODUCT_URL}/search?page=${currentPage}&size=10`;
    if (searchKeyword.trim() !== '') {
        url += `&keyword=${encodeURIComponent(searchKeyword)}`;
    }
    return await fetcher(url);
};

// 삭제된 특가상품 조회 (전체 조회)
export const getDeletedSpecialProducts = async () => {
    return await fetcher(`${SPECIAL_PRODUCT_URL}/findAllDeleted`);
};

// 특가상품 수정
export const updateSpecialProduct = async (productData) => {
    return await fetcher(SPECIAL_PRODUCT_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    });
};

// 특가상품 승인
export const approveSpecialProduct = async (id) => {
    return await fetcher(`${SPECIAL_PRODUCT_URL}/approve/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    });
};

// 특가상품 승인취소
export const cancelApproveSpecialProduct = async (id) => {
    return await fetcher(`${SPECIAL_PRODUCT_URL}/approveCancel/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    });
};

// 특가상품 삭제 (soft delete)
export const deleteSpecialProduct = async (id) => {
    return await fetcher(`${SPECIAL_PRODUCT_URL}/${id}`, { method: 'DELETE' });
};

// 특가상품 등록시 상품 검색 기능
export const searchProducts = async (keyword) => {
    const url = `${SEARCH_PRODUCTS_URL}?keyword=${encodeURIComponent(keyword)}`;
    return await fetcher(url);
};

// 특가상품 등록 API 호출
export const registerSpecialProduct = async (productData) => {
    return await fetcher(SPECIAL_PRODUCT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    });
};