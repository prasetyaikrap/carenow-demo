import { z } from "zod";
import { patientFormSchema } from "./constants";

export type PatientFormFieldValue = z.infer<typeof patientFormSchema>;

export type PatientData = {
  id: string;
  patient_id: string;
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
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type TreatmentData = {
  id: string;
  label: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type MedicationData = {
  id: string;
  label: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
