import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Slide,
  Stack,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PatientFormFieldValue } from "../type";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  medicationPrescribedOptions,
  patientFormSchema,
  treatmentDescriptionOptions,
} from "../constants";
import {
  FormAutoCompleteMultiInput,
  FormInput,
  FormInputDate,
  FormNumberInput,
} from "../../../components";

type CreatePatientFormDialogProps = {
  open: boolean;
  onClose: () => void;
  editMode?: boolean;
};

export default function CreatePatientFormDialog({
  open,
  editMode = false,
  onClose,
}: CreatePatientFormDialogProps) {
  const [defaultValues, setDefaultValues] = useState<PatientFormFieldValue>({
    id: "",
    name: "",
    treatment_date: new Date().toISOString(),
    treatment_description: [],
    medication_prescribed: [],
    cost_of_treatment: 0,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isValid },
    control,
  } = useForm<PatientFormFieldValue>({
    defaultValues,
    values: defaultValues,
    resolver: zodResolver(patientFormSchema),
    mode: "onChange",
  });

  const submitBtnLabel = editMode ? "Edit" : "Create";

  const handleCancel = () => {
    onClose();
  };

  const onSubmit = (data: PatientFormFieldValue) => {
    console.log(data);
  };

  useEffect(() => {}, [editMode]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slots={{
        transition: Transition,
      }}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit(onSubmit),
        },
      }}
      fullWidth>
      <DialogTitle>Create Patient Record</DialogTitle>
      <DialogContent>
        <Stack paddingY="16px" spacing="16px">
          <FormInput
            name="id"
            label="Patient ID"
            placeholder="Patient ID"
            control={control}
            required
          />
          <FormInput
            name="name"
            label="Patient Name"
            placeholder="Patient Name"
            control={control}
            required
          />
          <FormInputDate
            name="treatment_date"
            label="Date of Treatment"
            control={control}
            onChange={(value) => {
              setValue("treatment_date", value?.toISOString() || "");
            }}
          />
          <FormAutoCompleteMultiInput
            name="treatment_description"
            label="Treatment Description"
            options={treatmentDescriptionOptions}
            control={control}
            required
          />
          <FormAutoCompleteMultiInput
            name="medication_prescribed"
            label="Medication Prescribed"
            options={medicationPrescribedOptions}
            control={control}
            required
          />
          <FormNumberInput
            name="cost_of_treatment"
            label="Cost of Treatment"
            control={control}
            startAdornment={
              <InputAdornment position="start">Rp</InputAdornment>
            }
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={!isValid}>
          {submitBtnLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
