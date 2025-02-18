export const fetcher = async (endPoint, options = {}) => {
    try {
        const token = localStorage.getItem("jwt");

        const headers = {
            "Content-Type": "application/json",
            ...options.headers,
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(endPoint, {
            headers: headers,
            ...options,
        });

        if (response.status === 201 || response.status === 204) {
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
