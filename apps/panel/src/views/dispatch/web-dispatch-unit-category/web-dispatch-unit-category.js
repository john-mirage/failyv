import dispatchApi from "../../../api/dispatch-api";
import Sortable from "sortablejs";
import WebDispatchCategory from "../web-dispatch-category";
import { unitIsValid } from "../../../helpers/type-checkers";

class WebDispatchUnitCategory extends WebDispatchCategory {
  #hasBeenMountedOnce = false;
  #units;
  #webDispatchUnit = document.createElement("li", { is: "web-dispatch-unit" });
  #sortableInstance;

  constructor() {
    super();
    this.handleSortingEvent = this.handleSortingEvent.bind(this);
  }

  get units() {
    if (this.#units) {
      return this.#units;
    } else {
      throw new Error("The units are not defined");
    }
  }

  set units(newUnits) {
    if (
      Array.isArray(newUnits) &&
      newUnits.every((newUnit) => unitIsValid(newUnit))
    ) {
      this.#units = newUnits;
      if (this.isConnected) {
        this.updateCategoryUnits();
      }
    } else {
      throw new Error("The new units are not valid");
    }
  }

  updateCategoryUnits() {
    const units = dispatchApi.getCategoryUnits(this.category.id);
    const webDispatchUnits = units.map((unit) => {
      const webDispatchUnit = this.#webDispatchUnit.cloneNode(true);
      webDispatchUnit.unit = unit;
      return webDispatchUnit;
    });
    this.listElement.replaceChildren(...webDispatchUnits);
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.#hasBeenMountedOnce) {
      this.upgradeProperty("units");
      this.#sortableInstance = new Sortable(this.listElement, {
        group: "unit",
        onSort: this.handleSortingEvent,
      });
      this.#hasBeenMountedOnce = true;
    }
    this.updateCategoryUnits();
    this.updateCategoryCount();
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
          parentType: "category",
          parentId: this.category.id,
          parentOrderId: 0,
        });
        this.sendDispatchUpdateEvent();
      }
    }
  }
}

export default WebDispatchUnitCategory;
