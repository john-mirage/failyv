import "./main.css";
import WebApp from "./components/web-app";
import WebBar from "./components/web-bar";
import WebSidebar from "./components/web-sidebar";
import WebView from "./components/web-view";
import WebViewNavigation from "./components/web-view-navigation";
import WebViewNavigationItem from "./components/web-view-navigation-item";
import WebThemeSwitch from "./components/web-theme-switch";
import WebModeSwitch from "./components/web-mode-switch";
import WebButton from "./components/web-button";
import WebCloseButton from "./components/web-close-button";
import WebCarPlate from "./views/car-plate/web-car-plate";
import WebInvestigation from "./views/investigation/web-investigation";
import WebDispatch from "./views/dispatch/web-dispatch";
import WebDispatchToolbar from "./views/dispatch/web-dispatch-toolbar";
import WebDispatchGroupCategory from "./views/dispatch/web-dispatch-group-category";
import WebDispatchUnitCategory from "./views/dispatch/web-dispatch-unit-category";
import WebDispatchGroup from "./views/dispatch/web-dispatch-group";
import WebDispatchUnit from "./views/dispatch/web-dispatch-unit";

/**
 * global components
 */
customElements.define("web-app", WebApp);
customElements.define("web-bar", WebBar);
customElements.define("web-sidebar", WebSidebar);
customElements.define("web-view", WebView);
customElements.define("web-view-navigation", WebViewNavigation);
customElements.define("web-view-navigation-item", WebViewNavigationItem);
customElements.define("web-theme-switch", WebThemeSwitch);
customElements.define("web-mode-switch", WebModeSwitch);
customElements.define("web-button", WebButton);
customElements.define("web-close-button", WebCloseButton);

/**
 * car plate view
 */
customElements.define("web-car-plate", WebCarPlate);

/**
 * investigation view
 */
customElements.define("web-investigation", WebInvestigation);

/**
 * dispatch view
 */
customElements.define("web-dispatch", WebDispatch);
customElements.define("web-dispatch-toolbar", WebDispatchToolbar);
customElements.define("web-dispatch-group-category", WebDispatchGroupCategory, {
  extends: "li",
});
customElements.define("web-dispatch-unit-category", WebDispatchUnitCategory, {
  extends: "li",
});
customElements.define("web-dispatch-group", WebDispatchGroup, {
  extends: "li",
});
customElements.define("web-dispatch-unit", WebDispatchUnit, {
  extends: "li",
});

/**
 * app mount
 */
window.addEventListener("load", () => {
  const app = document.getElementById("app");
  const webApp = document.createElement("web-app");

  document.addEventListener("keyup", (keyboardEvent) => {
    if (keyboardEvent.key === "e") {
      if (app.children.length <= 0) {
        app.replaceChildren(webApp);
      }
    }
  });
});
