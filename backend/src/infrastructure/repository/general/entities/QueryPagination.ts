import InvariantError from "@/src/commons/exceptions/InvariantError";
import { match, P } from "ts-pattern";

export type QueryPaginationPayload<TQueryData = Record<string, any>> = {
  queries: TQueryData | null;
  _page: string | null;
  _limit: string | null;
  _sort: string | null;
  _cursor: string | null;
  _direction: string | null;
};

export type QueryPaginationProps<TQueryData> = {
  payload: QueryPaginationPayload<TQueryData>;
  keys: string[];
  maxLimit?: number;
  defaultOrder?: string;
};

export default class QueryPagination<
  TQueryData extends Record<string, any> = Record<string, any>
> {
  public queries: TQueryData | null;
  public _sort: string;
  public _page: number;
  public _limit: number;
  public _cursor: string;
  public _direction: string;

  constructor({
    payload,
    keys,
    maxLimit = 100,
    defaultOrder = "-created_at",
  }: QueryPaginationProps<TQueryData>) {
    this._verifyPayload(payload, maxLimit);
    const { _page, _limit, _sort, _cursor, _direction, queries } = payload;
    this.queries = this._pickQueries(queries, keys);
    this._page = parseInt(_page || "1");
    this._limit = parseInt(_limit || "10");
    this._sort = _sort || defaultOrder;
    this._cursor = _cursor || "";
    this._direction = _direction || "next";
  }

  _verifyPayload(
    payload: QueryPaginationPayload<TQueryData>,
    maxLimit: number
  ) {
    match(payload)
      .with({ _page: P.nullish }, () => {
        throw new InvariantError("Query _page is required");
      })
      .with({ _limit: P.nullish }, () => {
        throw new InvariantError("Query _limit is required");
      })
      .with({ _limit: P.when((v) => parseInt(v || "10") > maxLimit) }, () => {
        throw new InvariantError(
          "Query _limit cannot have value greater than 100"
        );
      })
      .with(
        P.union(
          { _cursor: P.string, _direction: P.nullish },
          { _cursor: P.nullish, _direction: P.string }
        ),
        () => {
          throw new InvariantError(
            "Query _cursor and _direction need to exist together"
          );
        }
      )
      .otherwise(() => {});
  }

  _pickQueries(
    queries: QueryPaginationPayload<TQueryData>["queries"],
    keys: string[]
  ) {
    if (!queries) return queries;

    return keys.reduce((result, current) => {
      let queryKey = current;
      let columnKey = current;

      if (current.includes(":")) {
        const [queryKeyFromConfig, columnKeyFromConfig] = current.split(":");
        queryKey = queryKeyFromConfig;
        columnKey = columnKeyFromConfig;
      }

      if (!queries[queryKey]) return result;

      return {
        ...result,
        [columnKey]: queries[queryKey],
      };
    }, {} as TQueryData);
  }
}
