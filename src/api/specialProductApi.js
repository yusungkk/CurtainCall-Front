import { fetcher } from "/src/utils/fetcher";
import { ACTIVE_SPECIAL_PRODUCT_URL } from "/src/utils/endpoint";

//삭제되지 않은 특가상품 조회
export const getActiveSpecialProducts = async () => {
    return await fetcher(ACTIVE_SPECIAL_PRODUCT_URL);
};
