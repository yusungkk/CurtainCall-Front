export const fetcher = async (endPoint, options={}) => {
    try {
        const response = await fetch(endPoint, {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options
        });

        if (response.status === 201 || response.status === 204) {
            return response.status;
        }

        if (response.ok) {
            return await response.json();
        }

        throw new Error(await response.json());

    }catch (e){
        console.log(e);
    }
};