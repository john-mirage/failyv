class WebView extends HTMLElement {
  #hasBeenMountedOnce = false;
  #views = new Map();

  static get observedAttributes() {
    return ["data-view"];
  }

  constructor() {
    super();
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
      this.classList.add("webView");
      this.#hasBeenMountedOnce = true;
    }
    this.upgradeProperty("view");
  }

  upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  getViewElement(viewName) {
    if (typeof viewName === "string") {
      if (!this.#views.has(viewName)) {
        const view = document.createElement(`web-${viewName}`);
        this.#views.set(viewName, view);
      }
      return this.#views.get(viewName);
    } else {
      throw new Error("The view name is not a string");
    }
  }

  handleViewChange(viewName) {
    const viewElement = this.getViewElement(viewName);
    this.replaceChildren(viewElement);
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    switch (name) {
      case "data-view": {
        if (typeof newValue === "string") {
          this.handleViewChange(newValue);
        }
        break;
      }
    }
  }
}

export default WebView;
