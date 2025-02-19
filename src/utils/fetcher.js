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

     // 에러 발생 시 JSON을 파싱한 후 errorMessage를 추출
    //     const errorResponse = await response.json();
    //     const message = errorResponse.errorMessage || errorResponse.message || "알 수 없는 오류";
    //     throw new Error(message);
    // } catch (e) {
    //     console.error(e);
    //     throw e;
    // }
};
