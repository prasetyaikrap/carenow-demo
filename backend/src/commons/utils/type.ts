export type FilterOperators =
  | "lessThan"
  | "dateLessThan"
  | "lessThanEqual"
  | "dateLessThanEqual"
  | "greaterThan"
  | "dateGreaterThan"
  | "greaterThanEqual"
  | "dateGreaterThanEqual"
  | "equal"
  | "dateEqual"
  | "notEqual"
  | "dateNotEqual"
  | "contains"
  | "notContains"
  | "arrayContains"
  | "notArrayContains"
  | "arrayContainsAny"
  | "between"
  | "notBetween"
  | "dateBetween"
  | "notDateBetween"
  | "isNull"

  // Custom
  | "havingArrayToStringContains";

export type QueryFilter = {
  field: string;
  value: string | number | boolean;
};
