import axios from "axios";
import { ENV } from "../../configs/env";

const apiClient = axios.create({
  baseURL: ENV.SERVICE_URL,
});

type GetPatientListProps = {
  _limit?: number;
  _page?: number;
  query?: {
    name?: string;
  };
};

export const getPatientList = async ({
  _limit = 5,
  _page = 0,
  query,
}: GetPatientListProps) => {
  const response = await apiClient.get("/patients", {
    params: {
      _page,
      _limit,
      query,
    },
  });

  return response.data;
};

type GetPatientByIdProps = {
  id: string;
};

export const getPatientbyId = async ({ id }: GetPatientByIdProps) => {
  const response = await apiClient.get(`/patients/${id}`);

  return response.data;
};

type CreatePatientRecordProps = {
  body: {
    id: string;
    name: string;
    treatment_date: string;
    treatment_description: {
      value: string;
      label: string;
    }[];
    medication_prescribed: {
      value: string;
      label: string;
    }[];
    cost_of_treatment: number;
  };
};

export const createPatientRecord = async ({
  body,
}: CreatePatientRecordProps) => {
  const response = await apiClient.post(`/patients`, body);

  return response.data;
};
type UpdatePatientRecordProps = {
  id: string;
  body: {
    name: string;
    treatment_date: string;
    treatment_description: {
      value: string;
      label: string;
    }[];
    medication_prescribed: {
      value: string;
      label: string;
    }[];
    cost_of_treatment: number;
  };
};

export const updatePatientRecord = async ({
  id,
  body,
}: UpdatePatientRecordProps) => {
  const response = await apiClient.put(`/patients/${id}`, body);

  return response.data;
};
