import { unitIsValid } from "../../../helpers/type-checkers";

class WebDispatchUnit extends HTMLLIElement {
  #hasBeenMountedOnce = false;
  #template;
  #numberElement;
  #nameElement;
  #roleElement;
  #unit;

  constructor() {
    super();
    const template = document.getElementById("template-web-dispatch-unit");
    this.#template = template.content.firstElementChild.cloneNode(true);
    this.#numberElement = this.#template.querySelector('[data-js="number"]');
    this.#nameElement = this.#template.querySelector('[data-js="name"]');
    this.#roleElement = this.#template.querySelector('[data-js="role"]');
  }

  get unit() {
    if (this.#unit) {
      return this.#unit;
    } else {
      throw new Error("The unit is not defined");
    }
  }

  set unit(newUnit) {
    if (unitIsValid(newUnit)) {
      this.#unit = newUnit;
      if (this.isConnected) {
        this.updateUnit();
      }
    } else {
      throw new Error("The new unit is not valid");
    }
  }

  updateUnitNumber() {
    const currentUnitNumber = this.unit.number;
    if (this.#numberElement.textContent !== currentUnitNumber) {
      this.#numberElement.textContent = currentUnitNumber;
    }
  }

  updateUnitName() {
    const currentUnitName = this.unit.name;
    if (this.#nameElement.textContent !== currentUnitName) {
      this.#nameElement.textContent = this.unit.name;
    }
    if (this.#nameElement.getAttribute("title") !== currentUnitName) {
      this.#nameElement.setAttribute("title", currentUnitName);
    }
  }

  updateUnitRole() {
    const newUnitRole = this.unit.role;
    if (this.#roleElement.textContent !== newUnitRole) {
      this.#roleElement.textContent = this.unit.role;
    }
  }

  updateUnit() {
    this.updateUnitNumber();
    this.updateUnitName();
    this.updateUnitRole();
  }

  upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  connectedCallback() {
    if (!this.#hasBeenMountedOnce) {
      this.classList.add("webDispatchUnit");
      this.append(this.#template);
      this.upgradeProperty("unit");
      this.#hasBeenMountedOnce = true;
    }
    this.updateUnit();
  }
}

export default WebDispatchUnit;
