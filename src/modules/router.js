import Index from "../pages";
import Page404 from "../pages/page404";
import Login from "../pages/user/login";
import Supporter from "../pages/support";

export const routes = {
    INDEX: "/",
    SUPPORT: "/support",
    SUPPORT_LOGIN: "/support/login",
};

let views = {};
views[routes.INDEX] = Index;
views[routes.SUPPORT] = Supporter;
views[routes.SUPPORT_LOGIN] = Login;

class Router {
    renderPage() {
        this._renderView(location.pathname);
    }

    redirect(route) {
        window.history.pushState({}, document.title, route);
        this._renderView(route);
    }

    render404() {
        new Page404().render();
    }

    _renderView(route) {
        const view = views[route] ? new views[route]() : new Page404();
        view.render();
    }
}

const router = new Router();

export default router;
