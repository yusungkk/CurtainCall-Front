import { fetcher } from "/src/utils/fetcher";
import { CATEGORY_URL } from "/src/utils/endpoint";

export const getActiveCategories = async () => {
    return await fetcher(CATEGORY_URL);
};