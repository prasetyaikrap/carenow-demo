import axios from "axios";
import { ENV } from "../../configs/env";

const apiClient = axios.create({
  baseURL: ENV.SERVICE_URL,
});

type GetTreatmentList = {
  _limit?: number;
  _page?: number;
  query?: {
    label?: string;
  };
};

export const getTreatmentList = async ({
  _limit = 5,
  _page = 0,
  query,
}: GetTreatmentList) => {
  const response = await apiClient.get("/v1/treatments", {
    params: {
      _page,
      _limit,
      query,
    },
  });

  return response.data;
};
