import httpNetwork from "./http";

const BACKEND_URL = "http://95.163.212.121";
const API_V1_PREFIX = "api/v1/chat/";

const routes = {
    USER_MESSAGES: "/user/messages",
    SUPPORT_CHATS: "/support/chats",
    SUPPORT_USER_MESSAGES: "/support/chats/",
};

export const STATUS_OK = "ok";


class API {
    constructor() {
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

    currentUserMessages = () =>
        this._get(routes.USER_MESSAGES).then(response => response.body);

    supportChats = () =>
        this._get(routes.SUPPORT_CHATS).then(response => response.body);

    supportUserMessages = userId =>
        this._get(routes.SUPPORT_USER_MESSAGES + userId).then(response => response.body);

    _get = route =>
        httpNetwork
            .get(this._getUrlByRoute(route));

    _post = async (route, body) => {
        const headers = {};
        const response = await httpNetwork.post(this._getUrlByRoute(route), body, headers);
        if (!response.ok && response.body && response.body.message === "incorrect CSRF token") {
            return await httpNetwork.post(this._getUrlByRoute(route), body, headers);
        }
        return response;
    };

    _getUrlByRoute = route => [BACKEND_URL, API_V1_PREFIX, route].join("/");

}

export default new API();
