import { fetcher } from "/src/utils/fetcher";
import {CATEGORY_URL, DELETE_CATEGORY_URL, DELETED_CATEGORY_URL, RESTORE_CATEGORY_URL} from "/src/utils/endpoint";

// 삭제되지않은 카테고리 조회
export const getActiveCategories = async () => {
    return await fetcher(CATEGORY_URL);
};

// 삭제된 카테고리 조회
export const getDeletedCategories = async () => {
    return await fetcher(DELETED_CATEGORY_URL);
};

// 카테고리 생성
export const createCategory = async (categoryData) => {
    return await fetcher(CATEGORY_URL, {
        method: "POST",
        body: JSON.stringify(categoryData),
    });
};

// 카테고리 삭제
export const deleteCategory = async (categoryId) => {
    if (!categoryId) return;
    return await fetcher(DELETE_CATEGORY_URL(categoryId), {
        method: 'DELETE',
    });
};

// 카테고리 복구
export const restoreCategory = async (categoryId) => {
    if (!categoryId) return;
    return await fetcher(RESTORE_CATEGORY_URL(categoryId), {
        method: 'PUT',
    });
};
