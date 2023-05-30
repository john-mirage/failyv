class WebBar extends HTMLElement {
  #hasBeenMountedOnce = false;
  #template;
  #labelElement;

  static get observedAttributes() {
    return ["data-label"];
  }

  get label() {
    return this.dataset.label;
  }

  set label(newLabel) {
    if (typeof newLabel === "string") {
      this.dataset.label = newLabel;
    } else {
      this.removeAttribute("data-label");
    }
  }

  constructor() {
    super();
    const template = document.getElementById("template-web-bar");
    this.#template = template.content.cloneNode(true);
    this.#labelElement = this.#template.querySelector('[data-js="label"]');
  }

  connectedCallback() {
    if (!this.#hasBeenMountedOnce) {
      this.classList.add("webBar");
      this.append(this.#template);
      this.#hasBeenMountedOnce = true;
    }
    this.upgradeProperty("label");
  }

  upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    switch (name) {
      case "data-label":
        this.#labelElement.textContent = newValue ?? "";
        break;
    }
  }
}

export default WebBar;
