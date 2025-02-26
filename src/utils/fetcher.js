export const fetcher = async (endPoint, options = {}) => {
    try {
        const headers = options.body instanceof FormData ? {} : { "Content-Type": "application/json" };

        const response = await fetch(endPoint, {
            headers: headers,
            credentials: 'include',
            ...options,
        });

        if (response.status === 201 || response.status === 204 || response.status === 401 || response.status === 403) {
            return response.status;
        }

        if (response.ok) {
            const data = await response.json().catch(() => null);
            return data;
        }

        const errorData = await response.json();

        if (response.status === 400) {
            return { error: errorData.message || "잘못된 요청입니다." };
        }

        throw new Error(errorData);

    } catch (e) {
        console.log(e);
    }
};
