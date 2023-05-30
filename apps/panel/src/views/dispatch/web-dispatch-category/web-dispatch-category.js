import { categoryIsValid } from "../../../helpers/type-checkers";

class WebDispatchCategory extends HTMLLIElement {
  #hasBeenMountedOnce = false;
  #template;
  #nameElement;
  #countElement;
  #category;

  constructor() {
    super();
    const template = document.getElementById("template-web-dispatch-category");
    this.#template = template.content.firstElementChild.cloneNode(true);
    this.#nameElement = this.#template.querySelector('[data-js="name"]');
    this.#countElement = this.#template.querySelector('[data-js="count"]');
    this.listElement = this.#template.querySelector('[data-js="list"]');
  }

  get category() {
    if (this.#category) {
      return this.#category;
    } else {
      throw new Error("The category is not defined");
    }
  }

  set category(newCategory) {
    if (categoryIsValid(newCategory)) {
      this.#category = newCategory;
      if (this.isConnected) {
        this.updateCategory();
      }
    } else {
      throw new Error("The new category is not valid");
    }
  }

  updateCategoryName() {
    const currentCategoryName = this.category.name;
    if (this.#nameElement.textContent !== currentCategoryName) {
      this.#nameElement.textContent = currentCategoryName;
    }
  }

  updateCategoryCount() {
    const count = this.listElement.children.length;
    const formatedCount = count > 0 ? ` (${String(count)})` : null;
    if (this.#countElement.textContent !== formatedCount) {
      this.#countElement.textContent = formatedCount;
    }
  }

  updateCategory() {
    this.updateCategoryName();
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
      this.classList.add("webDispatchCategory");
      this.append(this.#template);
      this.upgradeProperty("category");
      this.#hasBeenMountedOnce = true;
    }
    this.updateCategory();
  }
}

export default WebDispatchCategory;
