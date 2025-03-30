import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";

type FormAutoCompleteInputProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  options: {
    label: string;
    value: string | number;
  }[];
  required?: boolean;
};

export function FormAutoCompleteMultiInput<T extends FieldValues>({
  name,
  control,
  label,
  options,
  required,
}: FormAutoCompleteInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          multiple
          value={value}
          onChange={(_event, newValue) => {
            const valueMap = newValue
              .map((v) => {
                if (typeof v === "string") return { label: v, value: "" };
                return { label: v.label, value: v.value };
              })
              .filter(
                (value, index, self) =>
                  self.findIndex((v) => v.label === value.label) === index
              );

            onChange(valueMap);
          }}
          filterOptions={(options, params) => {
            const existingValue = new Set(
              (value as typeof options).map((v) => v.label)
            );
            const filtered = options.filter(
              (opt) => !existingValue.has(opt.label)
            );

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = existingValue.has(params.inputValue);

            if (inputValue !== "" && !isExisting) {
              filtered.push({
                value: "",
                label: inputValue,
              });
            }

            return filtered;
          }}
          getOptionLabel={(option) => option.label}
          options={options}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              helperText={error ? error.message : null}
              error={!!error}
              slotProps={{
                inputLabel: {
                  required,
                },
              }}
              fullWidth
            />
          )}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
        />
      )}
    />
  );
}
