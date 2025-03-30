import { z } from "zod";
import { patientFormSchema } from "./constants";

export type PatientFormFieldValue = z.infer<typeof patientFormSchema>;

export type PatientData = {
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
