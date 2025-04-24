import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CreatePatientFormDialog from "./components/CreatePatientFormDialog";
import { formatDate } from "../../utils/general";
import { useQuery } from "@tanstack/react-query";
import { BaseResponse, getPatientList, GetPatientListProps } from "../../libs";
import { PatientData } from "./type";

export default function Home() {
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filters, setFilters] =
    useState<GetPatientListProps["queries"]>(undefined);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const { data, isLoading, isFetching, refetch } = useQuery<
    BaseResponse<PatientData[]>
  >({
    queryKey: ["patients"],
    queryFn: () =>
      getPatientList({
        _limit: paginationModel.pageSize,
        _page: paginationModel.page + 1,
        queries: filters,
      }),
  });

  const ActionRender = useCallback(
    ({ row }: GridRenderCellParams<PatientData>) => {
      const onEdit = () => {
        setEditId(row.id);
      };

      return (
        <Stack
          direction="row"
          spacing="4px"
          height="100%"
          paddingY="8px"
          justifyContent="center"
          alignItems="center">
          <Button size="small" variant="outlined" onClick={onEdit}>
            Edit
          </Button>
        </Stack>
      );
    },
    [setEditId]
  );

  const columns: GridColDef<PatientData>[] = useMemo(
    () => [
      {
        field: "patient_id",
        headerName: "ID",
        headerAlign: "center",
        width: 100,
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
      {
        field: "action",
        headerName: "Action",
        headerAlign: "center",
        flex: 1,
        maxWidth: 100,
        renderCell: ActionRender,
      },
    ],
    [ActionRender]
  );

  const onFormClose = () => {
    setFormOpen(false);
    setEditId(null);
  };

  const onFormOpen = () => {
    setFormOpen(true);
  };

  const onFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.currentTarget;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!editId) return;
    setFormOpen(true);
  }, [editId]);

  return (
    <Container>
      <Stack spacing="40px">
        <Typography variant="h1" fontSize="24px" fontWeight={600}>
          Patient Database
        </Typography>

        <Stack spacing="20px">
          <Stack direction="row" justifyContent="space-between">
            <Stack gap="8px">
              <Typography fontSize="16px" fontWeight={600} textAlign="left">
                Filter
              </Typography>
              <Stack direction="row" gap="16px">
                <TextField
                  name="treatment"
                  size="small"
                  onChange={onFilterChange}
                  value={filters?.treatment || ""}
                  label="Treatment"
                />
                <Stack direction="row" gap="8px">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => refetch()}>
                    Filter
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setFilters(undefined)}>
                    Reset
                  </Button>
                </Stack>
              </Stack>
            </Stack>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <Button variant="contained" onClick={onFormOpen}>
                Create
              </Button>
            </Box>
          </Stack>
          <Paper sx={{ width: "100%" }}>
            <DataGrid
              rows={data?.data || []}
              columns={columns}
              disableColumnSorting
              disableColumnFilter
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[2, 5, 10]}
              rowHeight={100}
              paginationMode="server"
              rowCount={data?.metadata?.total_page || 0}
              loading={isLoading || isFetching}
              rowSelection={false}
            />
          </Paper>
        </Stack>
      </Stack>
      <CreatePatientFormDialog
        open={formOpen}
        onClose={onFormClose}
        editId={editId}
      />
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
