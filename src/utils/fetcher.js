export const fetcher = async (endPoint, options = {}) => {
    try {
        const headers = {
            "Content-Type": "application/json",
            ...options.headers,
        };

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

        throw new Error(await response.json());

    } catch (e) {
        console.log(e);
    }
};
