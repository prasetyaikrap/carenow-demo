import { LocalizationProvider, PickerValidDate } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type FormInputDateProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
} & DatePickerProps<PickerValidDate>;

export function FormInputDate<T extends FieldValues>({
  name,
  control,
  label,
  ...props
}: FormInputDateProps<T>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <DatePicker value={new Date(value)} onChange={onChange} {...props} />
        )}
      />
    </LocalizationProvider>
  );
}
