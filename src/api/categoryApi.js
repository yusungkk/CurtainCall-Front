import { fetcher } from "../utils/fetcher.js";
import { CATEGORY_URL } from "../utils/endpoint.js";

export const getActiveCategories = async () => {
  return await fetcher(CATEGORY_URL);
};

export const getDeletedCategories = async () => {
  return await fetcher(`${CATEGORY_URL}/findAllDeleted`);
};

export const createCategory = async (categoryData) => {
  return await fetcher(CATEGORY_URL, {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
};

export const updateCategory = async (categoryData) => {
  return await fetcher(CATEGORY_URL, {
    method: "PUT",
    body: JSON.stringify(categoryData),
  });
};

export const deleteCategory = async (id) => {
  return await fetcher(`${CATEGORY_URL}/${id}`, {
    method: "DELETE",
  });
};

export const restoreCategory = async (id) => {
  return await fetcher(`${CATEGORY_URL}/restore/${id}`, {
    method: "PUT",
  });
};
