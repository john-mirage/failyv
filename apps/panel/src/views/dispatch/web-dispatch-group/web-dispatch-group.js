import dispatchApi from "../../../api/dispatch-api";
import { groupIsValid } from "../../../helpers/type-checkers";
import Sortable from "sortablejs";

class WebDispatchGroup extends HTMLLIElement {
  #hasBeenMountedOnce = false;
  #template;
  #nameElement;
  #numberElement;
  #listElement;
  #deleteButtonElement;
  #webDispatchUnit = document.createElement("li", { is: "web-dispatch-unit" });
  #sortableInstance;
  #group;

  constructor() {
    super();
    const template = document.getElementById("template-web-dispatch-group");
    this.#template = template.content.firstElementChild.cloneNode(true);
    this.#nameElement = this.#template.querySelector('[data-js="name"]');
    this.#numberElement = this.#template.querySelector('[data-js="number"]');
    this.#listElement = this.#template.querySelector('[data-js="list"]');
    this.#deleteButtonElement = this.#template.querySelector(
      '[data-js="delete-button"]'
    );
    this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
    this.handleSortingEvent = this.handleSortingEvent.bind(this);
  }

  get group() {
    if (this.#group) {
      return this.#group;
    } else {
      throw new Error("The group is not defined");
    }
  }

  set group(newGroup) {
    if (groupIsValid(newGroup)) {
      this.#group = newGroup;
      if (this.isConnected) {
        this.updateGroup();
      }
    } else {
      throw new Error("The new group is not valid");
    }
  }

  updateGroupName() {
    const category = dispatchApi.getCategoryById(this.group.categoryId);
    if (this.#nameElement.textContent !== category.name) {
      this.#nameElement.textContent = category.name;
    }
  }

  updateGroupUnits() {
    const units = dispatchApi.getGroupUnits(this.group.id);
    const webDispatchUnits = units.map((unit) => {
      const webDispatchUnit = this.#webDispatchUnit.cloneNode(true);
      webDispatchUnit.unit = unit;
      return webDispatchUnit;
    });
    this.#listElement.replaceChildren(...webDispatchUnits);
  }

  updateGroupNumber() {
    const firstUnitNumber = this.#listElement.firstElementChild?.unit.number;
    if (firstUnitNumber) {
      if (this.#numberElement.textContent !== firstUnitNumber) {
        this.#numberElement.textContent = firstUnitNumber;
      }
    } else if (this.#numberElement.textContent !== null) {
      this.#numberElement.textContent = null;
    }
  }

  handleSortableFeature() {
    const isSortable = this.group.size > this.#listElement.children.length;
    if (isSortable) {
      this.#sortableInstance.option("group", { name: "unit", put: true });
    } else {
      this.#sortableInstance.option("group", { name: "unit", put: false });
    }
  }

  handleListHeight() {
    const style = getComputedStyle(this.#listElement);
    const gapProperty = style.getPropertyValue("--_list-gap");
    const paddingProperty = style.getPropertyValue("--_list-padding");
    const listItemHeightProperty = style.getPropertyValue(
      "--_list-item-height"
    );
    const gapNumber = String(Number(this.group.size) - 1);
    this.#listElement.style.setProperty(
      "--_list-height",
      `calc((${gapProperty} * ${gapNumber}) + (${paddingProperty} * 2) + (${listItemHeightProperty} * ${this.group.size}))`
    );
  }

  updateGroup() {
    this.updateGroupName();
    this.updateGroupUnits();
    this.updateGroupNumber();
    this.handleListHeight();
    this.handleSortableFeature();
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
      this.classList.add("webDispatchGroup");
      this.append(this.#template);
      this.upgradeProperty("group");
      this.#sortableInstance = new Sortable(this.#listElement, {
        group: "unit",
        onSort: this.handleSortingEvent,
      });
      this.#hasBeenMountedOnce = true;
    }
    this.updateGroup();
    this.#deleteButtonElement.addEventListener(
      "click",
      this.handleDeleteButtonClick
    );
  }

  disconnectedCallback() {
    this.#deleteButtonElement.removeEventListener(
      "click",
      this.handleDeleteButtonClick
    );
  }

  sendDispatchUpdateEvent() {
    const customEvent = new CustomEvent("dispatch-update", {
      bubbles: true,
    });
    this.dispatchEvent(customEvent);
  }

  handleDeleteButtonClick() {
    const webDispatchUnits = this.#listElement.children;
    if (webDispatchUnits.length > 0) {
      for (const webDispatchUnit of webDispatchUnits) {
        const newUnit = {
          ...webDispatchUnit.unit,
          parentType: "category",
          parentId: "2",
          parentOrderId: 0,
        };
        webDispatchUnit.unit = newUnit;
        dispatchApi.updateUnit(newUnit);
      }
    }
    dispatchApi.deleteGroup(this.group.id);
    this.sendDispatchUpdateEvent();
  }

  sendDispatchUpdateEvent() {
    const customEvent = new CustomEvent("dispatch-update", {
      bubbles: true,
    });
    this.dispatchEvent(customEvent);
  }

  handleSortingEvent(event) {
    if (event.from !== event.to) {
      if (this.contains(event.to)) {
        dispatchApi.updateUnit({
          ...event.item.unit,
          parentType: "group",
          parentId: this.group.id,
          parentOrderId: 0,
        });
        this.sendDispatchUpdateEvent();
      }
    } else {
      this.updateGroupNumber();
    }
  }
}

export default WebDispatchGroup;
