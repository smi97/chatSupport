const HEADER_CONTENT_TYPE = "Content-Type";
const CONTENT_TYPE_JSON = "application/json;charset=utf-8";

class HttpNetwork {
    get = (url, headers = {}) =>
        this._request(
            url,
            {
                method: "GET",
                mode: "cors",
                origin: true,
                credentials: "include",
            },
            headers
        );

    post = (url, body, headers = {}) =>
        this._request(
            url,
            {
                method: "POST",
                mode: "cors",
                origin: true,
                credentials: "include",
                body,
            },
            headers
        );

    async _request(url, options, headers = {}) {
        const { body } = options;
        const isFormData = body instanceof FormData;
        if (!isFormData) {
            headers[HEADER_CONTENT_TYPE] = CONTENT_TYPE_JSON;
        }
        const response = await fetch(url, {
            ...options,
            headers,
            body: isFormData ? body : JSON.stringify(body),
        });
        return await response.json();
    }
}

export default new HttpNetwork();
