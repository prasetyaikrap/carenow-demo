import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  LinearProgress,
  Slide,
  Stack,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  MedicationData,
  PatientData,
  PatientFormFieldValue,
  TreatmentData,
} from "../type";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormSchema } from "../constants";
import {
  FormAutoCompleteMultiInput,
  FormInput,
  FormInputDate,
  FormNumberInput,
} from "../../../components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BaseResponse,
  createPatientRecord,
  getMedicationList,
  getPatientbyId,
  getTreatmentList,
  updatePatientRecord,
} from "../../../libs";

type PatientFormDialogProps = {
  open: boolean;
  onClose: () => void;
  editId: string | null;
};

export default function PatientFormDialog({
  open,
  editId,
  onClose,
}: PatientFormDialogProps) {
  const defaultFormValues: PatientFormFieldValue = {
    id: "",
    name: "",
    treatment_date: new Date().toISOString(),
    treatment_description: [],
    medication_prescribed: [],
    cost_of_treatment: 0,
  };
  const editMode = Boolean(editId);
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultValues, setDefaultValues] =
    useState<PatientFormFieldValue>(defaultFormValues);

  const { data, isLoading, isFetching } = useQuery<BaseResponse<PatientData>>({
    queryKey: ["patientDetail", editId],
    queryFn: () =>
      getPatientbyId({
        id: editId || "",
      }),
    enabled: editMode,
  });
  const patientData = data?.data;

  const { data: treatments } = useQuery<BaseResponse<TreatmentData[]>>({
    queryKey: ["treatments", editId],
    queryFn: () => getTreatmentList({ _limit: 100, _page: 1 }),
  });
  const treatmentsOptions =
    treatments?.data.map((d) => ({ value: d.id, label: d.label })) || [];

  const { data: medications } = useQuery<BaseResponse<MedicationData[]>>({
    queryKey: ["medications", editId],
    queryFn: () => getMedicationList({ _limit: 100, _page: 1 }),
  });
  const medicationsOptions =
    medications?.data.map((d) => ({ value: d.id, label: d.label })) || [];

  const { mutate: createPatient } = useMutation({
    mutationFn: createPatientRecord,
  });
  const { mutate: updatePatient } = useMutation({
    mutationFn: updatePatientRecord,
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

  const submitBtnLabel = editId ? "Edit" : "Create";

  const handleCancel = () => {
    onClose();
  };

  const onSubmit = (data: PatientFormFieldValue) => {
    setIsSubmitting(true);
    if (editMode) {
      updatePatient(
        {
          id: editId || "",
          body: {
            id: data.id,
            name: data.name,
            treatment_date: data.treatment_date,
            treatment_description: data.treatment_description,
            medication_prescribed: data.medication_prescribed,
            cost_of_treatment: data.cost_of_treatment,
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patients"] });
            setIsSubmitting(false);
            onClose();
          },
        }
      );
    } else {
      createPatient(
        {
          body: {
            id: data.id,
            name: data.name,
            treatment_date: data.treatment_date,
            treatment_description: data.treatment_description,
            medication_prescribed: data.medication_prescribed,
            cost_of_treatment: data.cost_of_treatment,
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patients"] });
            setIsSubmitting(false);
            onClose();
          },
        }
      );
    }
  };

  useEffect(() => {
    if (!editMode) {
      return setDefaultValues(defaultFormValues);
    }

    if (editMode && patientData) {
      setDefaultValues({
        ...patientData,
        id: patientData.patient_id,
      });
    }
  }, [editMode, patientData]);

  const isEditLoading = editMode && (isLoading || isFetching);

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
      {isEditLoading && (
        <>
          <LinearProgress />
          <Box
            bgcolor="black"
            zIndex="10"
            position="absolute"
            width="100%"
            height="100%"
            sx={{
              opacity: ".2",
            }}
          />
        </>
      )}
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
            format="dd MMMM yyyy"
          />
          <FormAutoCompleteMultiInput
            name="treatment_description"
            label="Treatment Description"
            options={treatmentsOptions}
            control={control}
            required
          />
          <FormAutoCompleteMultiInput
            name="medication_prescribed"
            label="Medication Prescribed"
            options={medicationsOptions}
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
        <Button onClick={handleCancel} loading={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!isValid}
          loading={isSubmitting}>
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
