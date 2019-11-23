import httpNetwork from "./http";

const BACKEND_URL = "http://95.163.212.121";
const API_V1_PREFIX = "api/v1";
const API_PUBLIC_PREFIX = "public";
const API_PRIVATE_PREFIX = "private";

const routes = {
    USER_LIST: API_PUBLIC_PREFIX + "/user/list",
    USER_LOGIN: API_PUBLIC_PREFIX + "/user/login",
    USER_REGISTER: API_PUBLIC_PREFIX + "/user/register",
    USER_UPDATE: API_PRIVATE_PREFIX + "/user/update",
    USER_PROFILE: API_PRIVATE_PREFIX + "/user/me",
    USER_LOGOUT: API_PRIVATE_PREFIX + "/user/logout",
    USER_AVATAR_UPLOAD: API_PRIVATE_PREFIX + "/user/avatar/upload",
    USER_AVATAR_PREVIEW: API_PRIVATE_PREFIX + "/user/avatar/getByName",

    ACCESS_CSRF_TOKEN: API_PUBLIC_PREFIX + "/access/csrf",
};

export const STATUS_OK = "ok";

const CSRF_TOKEN_HEADER = "X-CSRF-Token";

class API {
    constructor() {
        this.csrfToken = null;
    }

    registerUser = (email, name, password) =>
        this._post(routes.USER_REGISTER, {
            email,
            name,
            password,
        });

    loginUser = (email, password) =>
        this._post(routes.USER_LOGIN, {
            email,
            password,
        });

    logoutUser = () => this._post(routes.USER_LOGOUT);

    updateUser = (name, password) =>
        this._post(routes.USER_UPDATE, {
            name,
            password,
        });

    updateAvatar = formData => this._post(routes.USER_AVATAR_UPLOAD, formData);

    currentUserProfile = () =>
        this._get(routes.USER_PROFILE).then(response => response.body.user);

    getAvatarPreviewUrl = name =>
        this._get(routes.USER_AVATAR_PREVIEW + "?name=" + name).then(
            response => response.body.avatar_url
        );

    listUsers = () =>
        this._get(routes.USER_LIST).then(response => response.body.users);

    _getCSRFToken = () =>
        this._get(routes.ACCESS_CSRF_TOKEN).then(
            response => response.body.token
        );

    _get = route =>
        httpNetwork
            .get(this._getUrlByRoute(route));

    _post = async (route, body) => {
        const headers = {};
        if (this._isPrivateRoute(route)) {
            if (this.csrfToken === null) {
                this.csrfToken = await this._getCSRFToken();
            }
            headers[CSRF_TOKEN_HEADER] = this.csrfToken;
        }
        const response = await httpNetwork.post(this._getUrlByRoute(route), body, headers);
        if (!response.ok && response.body && response.body.message === "incorrect CSRF token") {
            this.csrfToken = await this._getCSRFToken();
            headers[CSRF_TOKEN_HEADER] = this.csrfToken;
            return await httpNetwork.post(this._getUrlByRoute(route), body, headers);
        }
        return response;
    };

    _getUrlByRoute = route => [BACKEND_URL, API_V1_PREFIX, route].join("/");

    _isPrivateRoute = route => route.startsWith(API_PRIVATE_PREFIX);
}

export default new API();
