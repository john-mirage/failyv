class WebApp extends HTMLElement {
  #hasBeenMountedOnce = false;
  #hasAppListeners = false;
  #template;
  #viewElement;

  static get observedAttributes() {
    return ["data-mode", "data-view"];
  }

  constructor() {
    super();
    const template = document.getElementById("template-web-app");
    this.#template = template.content.firstElementChild.cloneNode(true);
    this.#viewElement = this.#template.querySelector('[data-js="view"]');
    this.handleAppViewEvent = this.handleAppViewEvent.bind(this);
    this.handleAppModeEvent = this.handleAppModeEvent.bind(this);
    this.handleAppShutdownEvent = this.handleAppShutdownEvent.bind(this);
    this.addEventListener("app-view", this.handleAppViewEvent);
    this.addEventListener("app-mode", this.handleAppModeEvent);
    this.#hasAppListeners = true;
  }

  get mode() {
    return this.dataset.mode;
  }

  set mode(newMode) {
    if (typeof newMode === "string") {
      this.dataset.mode = newMode;
    } else {
      this.removeAttribute("data-mode");
    }
  }

  get view() {
    return this.dataset.view;
  }

  set view(newView) {
    if (typeof newView === "string") {
      this.dataset.view = newView;
    } else {
      this.removeAttribute("data-view");
    }
  }

  connectedCallback() {
    if (!this.#hasBeenMountedOnce) {
      this.classList.add("webApp");
      this.append(this.#template);
      this.#hasBeenMountedOnce = true;
    }
    this.upgradeProperty("mode");
    this.upgradeProperty("view");
    if (!this.#hasAppListeners) {
      this.addEventListener("app-view", this.handleAppViewEvent);
      this.addEventListener("app-mode", this.handleAppModeEvent);
      this.#hasAppListeners = true;
    }
    this.addEventListener("app-shutdown", this.handleAppShutdownEvent);
  }

  disconnectedCallback() {
    this.removeEventListener("app-view", this.handleAppViewEvent);
    this.removeEventListener("app-mode", this.handleAppModeEvent);
    this.removeEventListener("app-shutdown", this.handleAppShutdownEvent);
    this.#hasAppListeners = false;
  }

  upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  handleAppMode(newMode) {
    switch (newMode) {
      case "window": {
        this.classList.remove("webApp--fullScreen");
        this.classList.add("webApp--window");
        break;
      }
      case "screen": {
        this.classList.remove("webApp--window");
        this.classList.add("webApp--fullScreen");
        break;
      }
      default: {
        throw new Error("The app mode is not valid");
      }
    }
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    switch (name) {
      case "data-mode": {
        if (typeof newValue === "string") {
          this.handleAppMode(newValue);
        }
        break;
      }
      case "data-view": {
        if (typeof newValue === "string") {
          this.#viewElement.view = newValue;
        }
        break;
      }
    }
  }

  handleAppViewEvent(customEvent) {
    const { view } = customEvent.detail;
    if (typeof view === "string") {
      this.view = view;
    } else {
      throw new Error("The view is not defined in the custom event");
    }
  }

  handleAppModeEvent(customEvent) {
    const { mode } = customEvent.detail;
    if (typeof mode === "string") {
      this.handleAppMode(mode);
    } else {
      throw new Error("The mode is not defined in the custom event");
    }
  }

  handleAppShutdownEvent() {
    this.remove();
  }
}

export default WebApp;
