import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import CreatePatientFormDialog from "./components/CreatePatientFormDialog";
import { PatientData } from "./type";
import { formatDate } from "../../utils/general";

export default function Home() {
  const [formOpen, setFormOpen] = useState(false);
  const columns: GridColDef<PatientData>[] = [
    {
      field: "id",
      headerName: "ID",
      headerAlign: "center",
      width: 70,
      align: "center",
    },
    {
      field: "name",
      headerName: "Patient Name",
      headerAlign: "center",
      flex: 1,
      maxWidth: 200,
    },
    {
      field: "treatment_date",
      headerName: "Treatment Date",
      headerAlign: "center",
      flex: 1,
      align: "center",
      maxWidth: 300,
      renderCell: DateRender,
    },
    {
      field: "treatment_description",
      headerName: "Treatment Description",
      headerAlign: "center",
      flex: 1,
      maxWidth: 400,
      renderCell: TreatmentDescRender,
    },
    {
      field: "medication_prescribed",
      headerName: "Medication Prescribed",
      headerAlign: "center",
      flex: 1,
      maxWidth: 400,
      renderCell: MedicationPrescribedRender,
    },
    {
      field: "cost_of_treatment",
      headerName: "Cost of Treatment (Rp)",
      headerAlign: "center",
      type: "number",
      flex: 1,
      maxWidth: 170,
    },
  ];

  const rows: PatientData[] = [
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

  const paginationModel = { page: 0, pageSize: 5 };

  const onFormClose = () => {
    setFormOpen(false);
  };

  const onFormOpen = () => {
    setFormOpen(true);
  };

  return (
    <Container>
      <Stack spacing="40px">
        <Typography variant="h1" fontSize="24px" fontWeight={600}>
          Patient Database
        </Typography>

        <Stack spacing="20px">
          <Stack direction="row" justifyContent="flex-end">
            <Button variant="contained" onClick={onFormOpen}>
              Create
            </Button>
          </Stack>
          <Paper sx={{ width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              rowHeight={100}
              sx={{ border: 0 }}
            />
          </Paper>
        </Stack>
      </Stack>
      <CreatePatientFormDialog open={formOpen} onClose={onFormClose} />
    </Container>
  );
}

function DateRender({ value }: GridRenderCellParams<PatientData>) {
  const { dateFormat } = formatDate({ date: value });
  return (
    <Box
      display="flex"
      height="100%"
      justifyContent="center"
      alignItems="center">
      <Typography whiteSpace="wrap">{`${dateFormat} WIB`}</Typography>
    </Box>
  );
}

function TreatmentDescRender({ value }: GridRenderCellParams<PatientData>) {
  const data = value as PatientData["treatment_description"];

  return (
    <Stack
      spacing="4px"
      height="100%"
      paddingY="8px"
      alignItems="flex-start"
      overflow="auto">
      {data.map((d) => (
        <Chip key={d.value} size="small" label={d.label} />
      ))}
    </Stack>
  );
}

function MedicationPrescribedRender({
  value,
}: GridRenderCellParams<PatientData>) {
  const data = value as PatientData["medication_prescribed"];

  return (
    <Stack
      spacing="4px"
      height="100%"
      paddingY="8px"
      alignItems="flex-start"
      overflow="auto">
      {data.map((d) => (
        <Chip key={d.value} size="small" label={d.label} />
      ))}
    </Stack>
  );
}
