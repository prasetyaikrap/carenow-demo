import initPostgresql from "@/src/commons/databases/postgres";
import {
  generateQueries,
  getPaginationMetadata,
} from "@/src/commons/utils/general";
import { QueryFilter } from "@/src/commons/utils/type";
import { sql } from "drizzle-orm";

export type TreatmentsRepositoryProps = {
  appPostgresInstance: ReturnType<typeof initPostgresql>;
};

type GetTreatmentListProps = {
  filters: QueryFilter[];
  orders: string[];
  page: number;
  limit: number;
};

export default class TreatmentsRepository {
  public name: string;
  public _appPostgresInstance: TreatmentsRepositoryProps["appPostgresInstance"];

  constructor({ appPostgresInstance }: TreatmentsRepositoryProps) {
    this.name = "Treatments Repository";
    this._appPostgresInstance = appPostgresInstance;
  }

  async getTreatmentList({
    filters,
    orders,
    page,
    limit,
  }: GetTreatmentListProps) {
    const { filterQueries, orderQueries } = generateQueries({
      filters,
      orders,
    });
    const offset = (page - 1) * limit;

    const {
      db: postgresDb,
      schema: { treatmentsTable },
    } = this._appPostgresInstance;

    const treatmentsData = await postgresDb
      .select()
      .from(treatmentsTable)
      .where(...[filterQueries])
      .orderBy(orderQueries)
      .limit(limit)
      .offset(offset);

    const resultTotalRows = await postgresDb
      .select({
        count: sql<number>`COUNT(${treatmentsTable.id})`,
      })
      .from(treatmentsTable)
      .where(...[filterQueries]);

    const metadata = getPaginationMetadata({
      totalRows: Number(resultTotalRows[0]?.count || 0),
      page,
      limit,
    });

    return {
      data: treatmentsData,
      metadata,
    };
  }
}
