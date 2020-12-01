export enum FilterTypeEnum {
    none = "",
    byId = "$_id",
    equals = "$eq",
    notEquals = "$ne",
    in = "$in",
    notIn = "$nin",
    greaterThan = "$gt",
    greaterThanOrEqual = "$gte",
    lessThan = "$lt",
    lessThanOrEqual = "$lte",
    and = "$and",
    or = "$or",
    not = "$not",
    matches = "$regex"
}
