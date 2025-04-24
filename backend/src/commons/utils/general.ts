import { sql } from "drizzle-orm";
import { FilterOperators, QueryFilter } from "./type";
import { match } from "ts-pattern";

export const parseDate = (dateStr: string) => {
  return new Date(dateStr.replace(/\//g, "-"));
};

export type GetPaginationMetadataProps = {
  totalRows: number;
  page: number;
  limit: number;
};

export function getPaginationMetadata({
  totalRows,
  page,
  limit,
}: GetPaginationMetadataProps) {
  const totalPages = Math.ceil(totalRows / limit);

  return {
    total_rows: totalRows,
    total_page: totalPages || 1,
    current_page: page,
    per_page: limit,
    previous_cursor: "",
    next_cursor: "",
  };
}

export type GenerateQueriesProps = {
  filters?: QueryFilter[];
  orders?: string[];
};
export function generateQueries({
  filters = [],
  orders = [],
}: GenerateQueriesProps) {
  const finalFilterSql = sql.empty();
  const filterQueriesMap = filters
    .map((filter) => {
      const { field, value } = filter;
      const [fieldKey, operator] = field.split("__") as [
        string,
        FilterOperators
      ];
      return match({ operator, fieldKey, value })
        .with({ operator: "equal" }, () => sql`${sql.raw(fieldKey)} = ${value}`)
        .with(
          { operator: "notEqual" },
          () => sql`${sql.raw(fieldKey)} <> ${value}`
        )
        .with(
          { operator: "lessThan" },
          () => sql`${sql.raw(fieldKey)} < ${value}`
        )
        .with(
          { operator: "lessThanEqual" },
          () => sql`${sql.raw(fieldKey)} <= ${value}`
        )
        .with(
          { operator: "greaterThan" },
          () => sql`${sql.raw(fieldKey)} > ${value}`
        )
        .with(
          { operator: "greaterThanEqual" },
          () => sql`${sql.raw(fieldKey)} >= ${value}`
        )
        .with(
          { operator: "dateLessThan" },
          () => sql`${sql.raw(`${fieldKey}::timestamp`)} < ${value}`
        )
        .with(
          { operator: "dateLessThanEqual" },
          () => sql`${sql.raw(`${fieldKey}::timestamp`)} <= ${value}`
        )
        .with(
          { operator: "dateGreaterThan" },
          () => sql`${sql.raw(`${fieldKey}::timestamp`)} > ${value}`
        )
        .with(
          { operator: "dateGreaterThanEqual" },
          () => sql`${sql.raw(`${fieldKey}::timestamp`)} >= ${value}`
        )
        .with(
          { operator: "contains" },
          () => sql`${sql.raw(fieldKey)} ILIKE ${`%${value}%`}`
        )
        .with(
          { operator: "notContains" },
          () => sql`${sql.raw(fieldKey)} NOT ILIKE ${`%${value}%`}`
        )
        .with(
          { operator: "arrayContains" },
          () =>
            sql`${sql.raw(fieldKey)} IN (${sql.join(
              value.toString().split(","),
              sql`, `
            )})`
        )
        .with(
          { operator: "notArrayContains" },
          () =>
            sql`${sql.raw(fieldKey)} NOT IN (${sql.join(
              value.toString().split(","),
              sql`, `
            )})`
        )
        .with(
          { operator: "arrayContainsAny" },
          () => sql`${value} = ANY (${sql.raw(fieldKey)})`
        )
        .with({ operator: "between" }, () => {
          const [from, to] = value.toString().split(",");
          return sql`${sql.raw(fieldKey)} BETWEEN ${from} AND ${to}`;
        })
        .with({ operator: "notBetween" }, () => {
          const [from, to] = value.toString().split(",");
          return sql`${sql.raw(fieldKey)} NOT BETWEEN ${from} AND ${to}`;
        })
        .with({ operator: "dateBetween" }, () => {
          const [from, to] = value.toString().split(",");
          return sql`${sql.raw(
            `${fieldKey}::timestamp`
          )} BETWEEN ${from} AND ${to}`;
        })
        .with({ operator: "notDateBetween" }, () => {
          const [from, to] = value.toString().split(",");
          return sql`${sql.raw(
            `${fieldKey}::timestamp`
          )} NOT BETWEEN ${from} AND ${to}`;
        })
        .with({ operator: "isNull", value: true }, () =>
          sql.raw(`${fieldKey} IS NULL`)
        )
        .with({ operator: "isNull", value: false }, () =>
          sql.raw(`${fieldKey} IS NOT NULL`)
        )
        .otherwise(() => undefined);
    })
    .filter((q) => q !== undefined);
  finalFilterSql.append(sql.join(filterQueriesMap, sql` AND `));

  const finalHavingSql = sql.empty();
  const havingQueriesMap = filters
    .map((filter) => {
      const { field, value } = filter;
      const [fieldKey, operator] = field.split("__") as [
        string,
        FilterOperators
      ];
      return match({ operator, fieldKey, value })
        .with({ operator: "havingArrayToStringContains" }, () =>
          sql.raw(
            `array_to_string(array_agg(${fieldKey}), ',') ILIKE '%${value}%'`
          )
        )
        .otherwise(() => undefined);
    })
    .filter((h) => h !== undefined);
  finalHavingSql.append(sql.join(havingQueriesMap, sql` AND `));

  const finalOrderSql = sql.empty();
  const orderQueriesMap = orders.map((order) => {
    if (order.startsWith("-")) {
      return sql.raw(`${order.slice(1)} DESC`);
    }

    return sql.raw(`${order} ASC`);
  });
  finalOrderSql.append(sql.join(orderQueriesMap, sql`, `));

  return {
    filterQueries: filterQueriesMap.length > 0 ? finalFilterSql : undefined,
    orderQueries: finalOrderSql,
    havingQueries: havingQueriesMap.length > 0 ? finalHavingSql : undefined,
  };
}

export function generateFilters(
  queries: {
    [key: string]: string;
  } | null
): QueryFilter[] {
  if (!queries) return [];
  return Object.keys(queries).map((field) => ({
    field,
    value: queries[field],
  }));
}
