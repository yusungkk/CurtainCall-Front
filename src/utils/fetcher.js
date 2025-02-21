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

        if (response.status === 201 || response.status === 204 || response.status === 401) {
            return response.status;
        }

        if (response.ok) {
            return await response.json();
        }

        throw new Error(await response.json());

    } catch (e) {
        console.log(e);
    }
};
