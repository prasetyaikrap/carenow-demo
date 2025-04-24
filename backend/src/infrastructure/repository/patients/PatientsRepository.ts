import initPostgresql from "@/src/commons/databases/postgres";
import InvariantError from "@/src/commons/exceptions/InvariantError";
import NotFoundError from "@/src/commons/exceptions/NotFoundError";
import {
  generateQueries,
  getPaginationMetadata,
} from "@/src/commons/utils/general";
import { QueryFilter } from "@/src/commons/utils/type";
import { eq, sql } from "drizzle-orm";

export type PatientsRepositoryProps = {
  appPostgresInstance: ReturnType<typeof initPostgresql>;
};

type GetPatientListProps = {
  filters: QueryFilter[];
  orders: string[];
  page: number;
  limit: number;
};

type GetPatientByIdProps = {
  id: string;
};

type CreatePatientProps = {
  payload: {
    id: string;
    name: string;
    treatment_date: string;
    treatment_description: {
      value: string;
      label: string;
    }[];
    medication_prescribed: {
      value: string;
      label: string;
    }[];
    cost_of_treatment: number;
  };
};

type UpdatePatientByIdProps = {
  id: string;
  payload: {
    id: string;
    name: string;
    treatment_date: string;
    treatment_description: {
      value: string;
      label: string;
    }[];
    medication_prescribed: {
      value: string;
      label: string;
    }[];
    cost_of_treatment: number;
  };
};

export default class PatientsRepository {
  public name: string;
  public _appPostgresInstance: PatientsRepositoryProps["appPostgresInstance"];

  constructor({ appPostgresInstance }: PatientsRepositoryProps) {
    this.name = "Patients Repository";
    this._appPostgresInstance = appPostgresInstance;
  }

  async getPatientList({ filters, orders, page, limit }: GetPatientListProps) {
    const { filterQueries, orderQueries, havingQueries } = generateQueries({
      filters,
      orders,
    });
    const offset = (page - 1) * limit;

    const {
      db: postgresDb,
      schema: {
        patientsTable,
        patientMedicationTable,
        patientTreatmentTable,
        medicationsTable,
        treatmentsTable,
      },
    } = this._appPostgresInstance;

    const patientsData = await postgresDb
      .select({
        id: patientsTable.id,
        patient_id: patientsTable.patient_id,
        name: patientsTable.name,
        treatment_date: patientsTable.treatment_date,
        cost_of_treatment: patientsTable.cost_of_treatment,
        treatment_description: sql<
          { value: string; label: string }[]
        >`array_agg(json_build_object('value', treatments.id, 'label', treatments."label")) as tr`,
        medication_prescribed: sql<
          { value: string; label: string }[]
        >`array_agg(json_build_object('value', medications.id, 'label', medications."label")) as med`,
        created_at: patientsTable.created_at,
        updated_at: patientsTable.updated_at,
        deleted_at: patientsTable.deleted_at,
      })
      .from(patientsTable)
      .leftJoin(
        patientTreatmentTable,
        eq(patientTreatmentTable.patient_id, patientsTable.id)
      )
      .leftJoin(
        treatmentsTable,
        eq(patientTreatmentTable.treatment_id, treatmentsTable.id)
      )
      .leftJoin(
        patientMedicationTable,
        eq(patientMedicationTable.patient_id, patientsTable.id)
      )
      .leftJoin(
        medicationsTable,
        eq(patientMedicationTable.medication_id, medicationsTable.id)
      )
      .where(...[filterQueries])
      .groupBy(patientsTable.id)
      .having(havingQueries)
      .orderBy(orderQueries)
      .limit(limit)
      .offset(offset);

    const sq = postgresDb
      .selectDistinct({
        article_id: patientsTable.id,
      })
      .from(patientsTable)
      .leftJoin(
        patientTreatmentTable,
        eq(patientTreatmentTable.patient_id, patientsTable.id)
      )
      .leftJoin(
        treatmentsTable,
        eq(patientTreatmentTable.treatment_id, treatmentsTable.id)
      )
      .leftJoin(
        patientMedicationTable,
        eq(patientMedicationTable.patient_id, patientsTable.id)
      )
      .leftJoin(
        medicationsTable,
        eq(patientMedicationTable.medication_id, medicationsTable.id)
      )
      .where(...[filterQueries])
      .as("sq");

    const resultTotalRows = await postgresDb
      .select({
        count: sql<number>`COUNT(${patientsTable.id})`,
      })
      .from(sq);

    const metadata = getPaginationMetadata({
      totalRows: Number(resultTotalRows[0]?.count || 0),
      page,
      limit,
    });

    return {
      data: patientsData,
      metadata,
    };
  }

  async getPatientById({ id }: GetPatientByIdProps) {
    const {
      db: postgresDb,
      schema: {
        patientsTable,
        patientMedicationTable,
        patientTreatmentTable,
        medicationsTable,
        treatmentsTable,
      },
    } = this._appPostgresInstance;

    const patientData = await postgresDb
      .select({
        id: patientsTable.id,
        patient_id: patientsTable.patient_id,
        name: patientsTable.name,
        treatment_date: patientsTable.treatment_date,
        cost_of_treatment: patientsTable.cost_of_treatment,
        treatment_description: sql<
          { value: string; label: string }[]
        >`array_agg(json_build_object('value', treatments.id, 'label', treatments."label")) as tr`,
        medication_prescribed: sql<
          { value: string; label: string }[]
        >`array_agg(json_build_object('value', medications.id, 'label', medications."label")) as med`,
        created_at: patientsTable.created_at,
        updated_at: patientsTable.updated_at,
        deleted_at: patientsTable.deleted_at,
      })
      .from(patientsTable)
      .leftJoin(
        patientTreatmentTable,
        eq(patientTreatmentTable.patient_id, patientsTable.id)
      )
      .leftJoin(
        treatmentsTable,
        eq(patientTreatmentTable.treatment_id, treatmentsTable.id)
      )
      .leftJoin(
        patientMedicationTable,
        eq(patientMedicationTable.patient_id, patientsTable.id)
      )
      .leftJoin(
        medicationsTable,
        eq(patientMedicationTable.medication_id, medicationsTable.id)
      )
      .where(eq(patientsTable.id, id))
      .groupBy(patientsTable.id);

    if (patientData.length <= 0) throw new NotFoundError("Article Not Found");

    return patientData[0];
  }

  async createPatient({ payload }: CreatePatientProps) {
    const {
      db: postgresDb,
      schema: {
        patientsTable,
        patientMedicationTable,
        patientTreatmentTable,
        medicationsTable,
        treatmentsTable,
      },
    } = this._appPostgresInstance;

    const result = await postgresDb.transaction(async (tx) => {
      const patientResult = await tx
        .insert(patientsTable)
        .values({
          patient_id: payload.id,
          name: payload.name,
          treatment_date: new Date(payload.treatment_date),
          cost_of_treatment: payload.cost_of_treatment,
        })
        .returning({ id: patientsTable.id });

      if (!patientResult[0]?.id) {
        throw new InvariantError("Insert patient failed");
      }

      // Treatment
      const newTreatment = payload.treatment_description.filter(
        (t) => t.value === ""
      );
      const existingTreatment = payload.treatment_description.filter(
        (t) => t.value !== ""
      );

      if (newTreatment.length > 0) {
        const treatmentsResult = await tx
          .insert(treatmentsTable)
          .values(newTreatment.map((t) => ({ label: t.label })))
          .returning({
            value: treatmentsTable.id,
            label: treatmentsTable.label,
          });
        if (treatmentsResult.length <= 0) {
          throw new InvariantError("Failed to upsert treatments");
        }
        existingTreatment.push(...treatmentsResult);
      }

      const patientTreatmentResult = await tx
        .insert(patientTreatmentTable)
        .values(
          existingTreatment.map((t) => ({
            patient_id: patientResult[0].id,
            treatment_id: t.value,
          }))
        )
        .returning({ id: patientTreatmentTable.id });

      if (patientTreatmentResult.length <= 0) {
        throw new InvariantError("Failed to upsert treatments");
      }

      // Medication
      const newMedication = payload.medication_prescribed.filter(
        (t) => t.value === ""
      );
      const existingMedication = payload.medication_prescribed.filter(
        (t) => t.value !== ""
      );

      if (newMedication.length > 0) {
        const medicationsResult = await tx
          .insert(medicationsTable)
          .values(newMedication.map((t) => ({ label: t.label })))
          .returning({
            value: medicationsTable.id,
            label: medicationsTable.label,
          });
        if (medicationsResult.length <= 0) {
          throw new InvariantError("Failed to upsert medications");
        }
        existingMedication.push(...medicationsResult);
      }

      const patientMedicationResult = await tx
        .insert(patientMedicationTable)
        .values(
          existingMedication.map((t) => ({
            patient_id: patientResult[0].id,
            medication_id: t.value,
          }))
        )
        .returning({ id: patientMedicationTable.id });

      if (patientMedicationResult.length <= 0) {
        throw new InvariantError("Failed to upsert medications");
      }

      return { id: patientResult[0].id };
    });

    return result;
  }

  async updatePatientById({ id, payload }: UpdatePatientByIdProps) {
    const now = new Date();
    const {
      db: postgresDb,
      schema: {
        patientsTable,
        patientMedicationTable,
        patientTreatmentTable,
        medicationsTable,
        treatmentsTable,
      },
    } = this._appPostgresInstance;

    const result = await postgresDb.transaction(async (tx) => {
      const patientResult = await tx
        .update(patientsTable)
        .set({
          patient_id: payload.id,
          name: payload.name,
          treatment_date: new Date(payload.treatment_date),
          cost_of_treatment: payload.cost_of_treatment,
          updated_at: now,
        })
        .where(eq(patientsTable.id, id))
        .returning({ id: patientsTable.id });

      if (!patientResult[0]?.id) {
        throw new InvariantError("Insert patient failed");
      }

      // Treatment
      await tx
        .delete(patientTreatmentTable)
        .where(eq(patientTreatmentTable.patient_id, id));
      const newTreatment = payload.treatment_description.filter(
        (t) => t.value === ""
      );
      const existingTreatment = payload.treatment_description.filter(
        (t) => t.value !== ""
      );

      if (newTreatment.length > 0) {
        const treatmentsResult = await tx
          .insert(treatmentsTable)
          .values(newTreatment.map((t) => ({ label: t.label })))
          .returning({
            value: treatmentsTable.id,
            label: treatmentsTable.label,
          });
        if (treatmentsResult.length <= 0) {
          throw new InvariantError("Failed to upsert treatments");
        }
        existingTreatment.push(...treatmentsResult);
      }

      const patientTreatmentResult = await tx
        .insert(patientTreatmentTable)
        .values(
          existingTreatment.map((t) => ({
            patient_id: patientResult[0].id,
            treatment_id: t.value,
          }))
        )
        .returning({ id: patientTreatmentTable.id });

      if (patientTreatmentResult.length <= 0) {
        throw new InvariantError("Failed to upsert treatments");
      }

      // Medication
      await tx
        .delete(patientMedicationTable)
        .where(eq(patientMedicationTable.patient_id, id));
      const newMedication = payload.medication_prescribed.filter(
        (t) => t.value === ""
      );
      const existingMedication = payload.medication_prescribed.filter(
        (t) => t.value !== ""
      );

      if (newMedication.length > 0) {
        const medicationsResult = await tx
          .insert(medicationsTable)
          .values(newMedication.map((t) => ({ label: t.label })))
          .returning({
            value: medicationsTable.id,
            label: medicationsTable.label,
          });
        if (medicationsResult.length <= 0) {
          throw new InvariantError("Failed to upsert medications");
        }
        existingMedication.push(...medicationsResult);
      }

      const patientMedicationResult = await tx
        .insert(patientMedicationTable)
        .values(
          existingMedication.map((t) => ({
            patient_id: patientResult[0].id,
            medication_id: t.value,
          }))
        )
        .returning({ id: patientMedicationTable.id });

      if (patientMedicationResult.length <= 0) {
        throw new InvariantError("Failed to upsert medications");
      }

      return { id: patientResult[0].id };
    });

    return result;
  }
}
