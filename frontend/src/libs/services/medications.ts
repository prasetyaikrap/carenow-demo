import axios from "axios";
import { ENV } from "../../configs/env";

const apiClient = axios.create({
  baseURL: ENV.SERVICE_URL,
});

type GetMedicationList = {
  _limit?: number;
  _page?: number;
  query?: {
    label?: string;
  };
};

export const getMedicationList = async ({
  _limit = 5,
  _page = 0,
  query,
}: GetMedicationList) => {
  const response = await apiClient.get("/v1/medications", {
    params: {
      _page,
      _limit,
      query,
    },
  });

  return response.data;
};
