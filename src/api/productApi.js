import { fetcher } from "/src/utils/fetcher";
import { PRODUCT_URL, DELETE_PRODUCT_URL } from "/src/utils/endpoint";

export const getProduct = async (id) => {
    const URL = `${PRODUCT_URL}/${id}`;
    return await fetcher(URL);
};

export const deleteProduct = async (id) => {
    return fetcher(DELETE_PRODUCT_URL(id), {
        method: "DELETE",
    });
};
