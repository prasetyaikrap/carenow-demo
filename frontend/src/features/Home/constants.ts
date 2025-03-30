import { z } from "zod";
import { PatientData } from "./type";

export const patientFormSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  treatment_date: z.string().min(1),
  treatment_description: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .min(1),
  medication_prescribed: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .min(1),
  cost_of_treatment: z.number().gt(0),
});

export const treatmentDescriptionOptions = [
  {
    label: "Pemeriksaan Normal",
    value: "TD001",
  },
];

export const medicationPrescribedOptions = [
  {
    label: "Paracetamol 100gr",
    value: "MED001",
  },
];

export const mockRows: PatientData[] = [
  {
    id: "1",
    name: "Snow",
    treatment_date: new Date().toISOString(),
    treatment_description: [
      { label: "Pemeriksaan Normal", value: "TD001" },
      { label: "Test Darah", value: "TD002" },
    ],
    medication_prescribed: [{ label: "Paracetamol 100gr", value: "MED001" }],
    cost_of_treatment: 100000,
  },
  {
    id: "2",
    name: "Lannister",
    treatment_date: new Date().toISOString(),
    treatment_description: [
      { label: "Pemeriksaan Normal", value: "TD001" },
      { label: "Test Darah", value: "TD002" },
    ],
    medication_prescribed: [{ label: "Paracetamol 100gr", value: "MED001" }],
    cost_of_treatment: 250000,
  },
  {
    id: "3",
    name: "Lannister",
    treatment_date: new Date().toISOString(),
    treatment_description: [
      { label: "Pemeriksaan Normal", value: "TD001" },
      { label: "Test Darah", value: "TD002" },
    ],
    medication_prescribed: [{ label: "Paracetamol 100gr", value: "MED001" }],
    cost_of_treatment: 350000,
  },
  {
    id: "4",
    name: "Stark",
    treatment_date: new Date().toISOString(),
    treatment_description: [
      { label: "Pemeriksaan Normal", value: "TD001" },
      { label: "Test Darah", value: "TD002" },
    ],
    medication_prescribed: [{ label: "Paracetamol 100gr", value: "MED001" }],
    cost_of_treatment: 1200000,
  },
];
