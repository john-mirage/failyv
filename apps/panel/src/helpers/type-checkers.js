export const categoryIsValid = (category) => {
  return (
    Object.keys(category).length === 3 &&
    category.hasOwnProperty("id") &&
    category.hasOwnProperty("type") &&
    category.hasOwnProperty("name") &&
    typeof category.id === "string" &&
    typeof category.type === "string" &&
    typeof category.name === "string"
  );
};

export const groupIsValid = (group) => {
  return (
    Object.keys(group).length === 4 &&
    group.hasOwnProperty("categoryId") &&
    group.hasOwnProperty("categoryOrderId") &&
    group.hasOwnProperty("id") &&
    group.hasOwnProperty("size") &&
    typeof group.categoryId === "string" &&
    typeof group.categoryOrderId === "number" &&
    typeof group.id === "string" &&
    typeof group.size === "string"
  );
};

export const unitIsValid = (unit) => {
  return (
    Object.keys(unit).length === 7 &&
    unit.hasOwnProperty("parentType") &&
    unit.hasOwnProperty("parentId") &&
    unit.hasOwnProperty("parentOrderId") &&
    unit.hasOwnProperty("id") &&
    unit.hasOwnProperty("number") &&
    unit.hasOwnProperty("name") &&
    unit.hasOwnProperty("role") &&
    typeof unit.parentType === "string" &&
    typeof unit.parentId === "string" &&
    typeof unit.parentOrderId === "number" &&
    typeof unit.id === "string" &&
    typeof unit.number === "string" &&
    typeof unit.name === "string" &&
    typeof unit.role === "string"
  );
};
