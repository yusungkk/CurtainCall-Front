import { fetcher } from "/src/utils/fetcher";
import {CATEGORY_URL, DELETE_CATEGORY_URL, DELETED_CATEGORY_URL} from "/src/utils/endpoint";

// 삭제되지않은 카테고리 조회 API 호출 함수
export const getActiveCategories = async () => {
    return await fetcher(CATEGORY_URL);
};

// 삭제된 카테고리 조회 API 호출 함수
export const getDeletedCategories = async () => {
    return await fetcher(DELETED_CATEGORY_URL);
};

// 카테고리 생성 API 호출 함수
export const createCategory = async (categoryData) => {
    return await fetcher(CATEGORY_URL, {
        method: "POST",
        body: JSON.stringify(categoryData),
    });
};

// 카테고리 삭제 API 호출 함수
export const deleteCategory = async (categoryId) => {
    try {
        const response = await fetcher(DELETE_CATEGORY_URL(categoryId), { method: 'DELETE' });
        return response;
    } catch (error) {
        throw new Error("카테고리 삭제에 실패했습니다.");
    }
};
