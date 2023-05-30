import dispatchApi from "../../../api/dispatch-api";
import WebDispatchCategory from "../web-dispatch-category";
import { groupIsValid } from "../../../helpers/type-checkers";

class WebDispatchGroupCategory extends WebDispatchCategory {
  #hasBeenMountedOnce = false;
  #groups;
  #webDispatchGroup = document.createElement("li", {
    is: "web-dispatch-group",
  });

  constructor() {
    super();
  }

  get groups() {
    if (this.#groups) {
      return this.#groups;
    } else {
      throw new Error("The groups are not defined");
    }
  }

  set groups(newGroups) {
    if (
      Array.isArray(newGroups) &&
      newGroups.every((newGroup) => groupIsValid(newGroup))
    ) {
      this.#groups = newGroups;
      if (this.isConnected) {
        this.updateCategoryGroups();
      }
    } else {
      throw new Error("The new groups are not valid");
    }
  }

  updateCategoryGroups() {
    const groups = dispatchApi.getCategoryGroups(this.category.id);
    const webDispatchGroups = groups.map((group) => {
      const webDispatchGroup = this.#webDispatchGroup.cloneNode(true);
      webDispatchGroup.group = group;
      return webDispatchGroup;
    });
    this.listElement.replaceChildren(...webDispatchGroups);
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.#hasBeenMountedOnce) {
      this.upgradeProperty("groups");
      this.#hasBeenMountedOnce = true;
    }
    this.updateCategoryGroups();
    this.updateCategoryCount();
  }
}

export default WebDispatchGroupCategory;
