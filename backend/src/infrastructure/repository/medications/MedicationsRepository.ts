import initPostgresql from "@/src/commons/databases/postgres";
import {
  generateQueries,
  getPaginationMetadata,
} from "@/src/commons/utils/general";
import { QueryFilter } from "@/src/commons/utils/type";
import { sql } from "drizzle-orm";

export type MedicationsRepositoryProps = {
  appPostgresInstance: ReturnType<typeof initPostgresql>;
};

type GetMedicationListProps = {
  filters: QueryFilter[];
  orders: string[];
  page: number;
  limit: number;
};

export default class MedicationsRepository {
  public name: string;
  public _appPostgresInstance: MedicationsRepositoryProps["appPostgresInstance"];

  constructor({ appPostgresInstance }: MedicationsRepositoryProps) {
    this.name = "Medications Repository";
    this._appPostgresInstance = appPostgresInstance;
  }

  async getMedicationsList({
    filters,
    orders,
    page,
    limit,
  }: GetMedicationListProps) {
    const { filterQueries, orderQueries } = generateQueries({
      filters,
      orders,
    });
    const offset = (page - 1) * limit;

    const {
      db: postgresDb,
      schema: { medicationsTable },
    } = this._appPostgresInstance;

    const medicationsData = await postgresDb
      .select()
      .from(medicationsTable)
      .where(...[filterQueries])
      .orderBy(orderQueries)
      .limit(limit)
      .offset(offset);

    const resultTotalRows = await postgresDb
      .select({
        count: sql<number>`COUNT(${medicationsTable.id})`,
      })
      .from(medicationsTable)
      .where(...[filterQueries]);

    const metadata = getPaginationMetadata({
      totalRows: Number(resultTotalRows[0]?.count || 0),
      page,
      limit,
    });

    return {
      data: medicationsData,
      metadata,
    };
  }
}
