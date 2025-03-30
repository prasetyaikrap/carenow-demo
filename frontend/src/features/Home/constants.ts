import { z } from "zod";

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
