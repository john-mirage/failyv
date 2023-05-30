import dispatchCategories from "../data/dispatch-categories.json";
import dispatchGroups from "../data/dispatch-groups.json";
import dispatchUnits from "../data/dispatch-units.json";
import { unitIsValid } from "../helpers/type-checkers";

class DispatchAPI {
  #categories = new Map();
  #groups = new Map();
  #units = new Map();

  constructor(categories, groups, units) {
    categories.forEach((category) => {
      this.#categories.set(category.id, category);
    });
    groups.forEach((group) => {
      this.#groups.set(group.id, group);
    });
    units.forEach((unit) => {
      this.#units.set(unit.id, unit);
    });
    this.compareTwoGroupsByOrderId = this.compareTwoGroupsByOrderId.bind(this);
    this.compareTwoUnitsByOrderId = this.compareTwoUnitsByOrderId.bind(this);
  }

  get categories() {
    return [...this.#categories.values()];
  }

  get groups() {
    return [...this.#groups.values()];
  }

  get units() {
    return [...this.#units.values()];
  }

  getCategoryById(categoryId) {
    if (typeof categoryId === "string") {
      const category = this.#categories.get(categoryId);
      if (category) {
        return category;
      } else {
        throw new Error("The category has not been found");
      }
    } else {
      throw new Error("The category id is not a string");
    }
  }

  compareTwoNumbers(numberA, numberB) {
    if (typeof numberA === "number" && typeof numberB === "number") {
      return numberA - numberB;
    } else {
      throw new Error("The two arguments are not numbers");
    }
  }

  compareTwoGroupsByOrderId(groupA, groupB) {
    return this.compareTwoNumbers(
      groupA.categoryOrderId,
      groupB.categoryOrderId
    );
  }

  compareTwoUnitsByOrderId(unitA, unitB) {
    return this.compareTwoNumbers(unitA.parentOrderId, unitB.parentOrderId);
  }

  getCategoryGroups(categoryId) {
    if (typeof categoryId === "string") {
      const category = this.#categories.get(categoryId);
      const groups = this.groups.filter(
        (group) => group.categoryId === category.id
      );
      return groups.sort(this.compareTwoGroupsByOrderId);
    } else {
      throw new Error("The category id is not a string");
    }
  }

  getCategoryUnits(categoryId) {
    if (typeof categoryId === "string") {
      const category = this.#categories.get(categoryId);
      if (category) {
        const units = this.units.filter(
          (unit) =>
            typeof unit.parentType === "string" &&
            typeof unit.parentId === "string" &&
            unit.parentType === "category" &&
            unit.parentId === category.id
        );
        return units.sort(this.compareTwoUnitsByOrderId);
      } else {
        throw new Error("The category has not been found");
      }
    } else {
      throw new Error("The category id is not a string");
    }
  }

  getGroupUnits(groupId) {
    if (typeof groupId === "string") {
      const group = this.#groups.get(groupId);
      if (group) {
        const units = this.units.filter(
          (unit) =>
            typeof unit.parentType === "string" &&
            typeof unit.parentId === "string" &&
            unit.parentType === "group" &&
            unit.parentId === group.id
        );
        return units.sort(this.compareTwoUnitsByOrderId);
      } else {
        throw new Error("The group has not been found");
      }
    } else {
      throw new Error("The group id is not a string");
    }
  }

  updateUnit(newUnit) {
    if (unitIsValid(newUnit)) {
      if (this.#units.has(newUnit.id)) {
        this.#units.set(newUnit.id, newUnit);
      } else {
        throw new Error("The unit you want to modify do not exist");
      }
    } else {
      throw new Error("The new unit is not valid");
    }
  }

  deleteGroup(groupId) {
    if (typeof groupId === "string") {
      if (this.#groups.has(groupId)) {
        this.#groups.delete(groupId);
      } else {
        throw new Error("The group to delete has not been found");
      }
    } else {
      throw new Error("The group id is not a string");
    }
  }
}

export default new DispatchAPI(
  dispatchCategories,
  dispatchGroups,
  dispatchUnits
);
