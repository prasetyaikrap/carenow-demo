import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
} from "@mui/material";

type FormOutlinedInputProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
} & OutlinedInputProps;

export function FormOutlinedInput<T extends FieldValues>({
  name,
  control,
  label,
  ...props
}: FormOutlinedInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl fullWidth>
          <InputLabel htmlFor={name}>{label}</InputLabel>
          <OutlinedInput
            id={name}
            label={label}
            error={!!error}
            value={value}
            onChange={onChange}
            {...props}
          />
          <FormHelperText>{error ? error.message : null}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
