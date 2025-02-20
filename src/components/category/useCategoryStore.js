import { create } from 'zustand';

const BASE_URL = 'http://localhost:8080/api/v1/categories';

const useCategoryStore = create((set, get) => ({
    categories: [],
    loading: false,
    error: null,

    // 카테고리 전체 조회
    getCategories: async () => {
        set({ loading: true });
        try {
            const res = await fetch(BASE_URL);
            if (!res.ok) {
                throw new Error('활성 카테고리를 불러오지 못했습니다.');
            }
            const data = await res.json();
            set({ categories: data, error: null, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    // 카테고리 생성 (Optimistic UI 적용)
    createCategory: async (categoryName, parentId = null) => {
        try {
            const newCategory = { id: Date.now(), name: categoryName, parentId };
            set((state) => ({ categories: [...state.categories, newCategory] }));

            const res = await fetch(BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: categoryName, parentId }),
            });

            if (!res.ok) {
                throw new Error('카테고리 생성에 실패했습니다.');
            }

            await get().getCategories();
        } catch (error) {
            set({ error: error.message });
        }
    },

    // 카테고리 수정 (Optimistic UI 적용)
    updateCategory: async (updatedCategory) => {
        try {
            set((state) => ({
                categories: state.categories.map((cat) =>
                    cat.id === updatedCategory.id ? updatedCategory : cat
                ),
            }));

            const res = await fetch(BASE_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCategory),
            });

            if (!res.ok) {
                throw new Error('카테고리 수정에 실패했습니다.');
            }

            await get().getCategories();
        } catch (error) {
            set({ error: error.message });
        }
    },

    // 카테고리 삭제 (Optimistic UI 적용)
    deleteCategory: async (categoryId) => {
        try {
            set((state) => ({
                categories: state.categories.filter((cat) => cat.id !== categoryId),
            }));

            const res = await fetch(`${BASE_URL}/${categoryId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('카테고리 삭제에 실패했습니다.');
            }

            await get().getCategories();
        } catch (error) {
            set({ error: error.message });
        }
    },
}));

export default useCategoryStore;
