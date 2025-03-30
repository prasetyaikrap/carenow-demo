import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
} from "@mui/material";

type FormNumberInputProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
} & OutlinedInputProps;

export function FormNumberInput<T extends FieldValues>({
  name,
  control,
  label,
  ...props
}: FormNumberInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl fullWidth>
          <InputLabel htmlFor={name} required={props.required}>
            {label}
          </InputLabel>
          <OutlinedInput
            id={name}
            label={label}
            error={!!error}
            value={value || ""}
            type="number"
            onChange={(e) => {
              const numberValue = Number(e.currentTarget.value);
              onChange(numberValue);
            }}
            inputMode="numeric"
            inputProps={{ inputMode: "numeric" }}
            {...props}
          />
          <FormHelperText>{error ? error.message : null}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
