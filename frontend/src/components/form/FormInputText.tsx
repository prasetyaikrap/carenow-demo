import { Control, Controller, FieldValues, Path } from "react-hook-form";
import TextField, { TextFieldProps } from "@mui/material/TextField";

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
} & TextFieldProps;

export function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  ...props
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          helperText={error ? error.message : null}
          error={!!error}
          onChange={onChange}
          value={value}
          fullWidth
          label={label}
          {...props}
        />
      )}
    />
  );
}
