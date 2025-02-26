import { fetcher } from "/src/utils/fetcher";
import {CATEGORY_URL, DELETED_CATEGORY_URL} from "/src/utils/endpoint";

export const getActiveCategories = async () => {
    return await fetcher(CATEGORY_URL);
};

export const getDeletedCategories = async () => {
    return await fetcher(DELETED_CATEGORY_URL);
};