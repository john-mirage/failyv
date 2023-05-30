class WebPowerButton extends HTMLElement {
  #hasBeenMountedOnce = false;
  #template;
  #iconElement;
  #labelElement;

  static get observedAttributes() {
    return ["data-icon", "data-label"];
  }

  get icon() {
    return this.dataset.icon;
  }

  set icon(newIcon) {
    if (typeof newIcon === "string") {
      this.dataset.icon = newIcon;
    } else {
      this.removeAttribute("data-icon");
    }
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
    const template = document.getElementById("template-web-button");
    this.#template = template.content.cloneNode(true);
    this.#iconElement = this.#template.querySelector('[data-js="icon"]');
    this.#labelElement = this.#template.querySelector('[data-js="label"]');
    this.buttonElement = this.#template.querySelector('[data-js="button"]');
  }

  connectedCallback() {
    if (!this.#hasBeenMountedOnce) {
      this.classList.add("webButton");
      this.append(this.#template);
      this.#hasBeenMountedOnce = true;
    }
    this.upgradeProperty("icon");
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
      case "data-icon": {
        if (typeof newValue === "string") {
          this.#iconElement.setAttribute("href", `#icon-${newValue}`);
        }
        break;
      }
      case "data-label": {
        this.#labelElement.textContent = newValue ?? "";
        break;
      }
    }
  }
}

export default WebPowerButton;
