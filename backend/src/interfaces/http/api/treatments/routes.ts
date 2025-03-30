// @ts-nocheck
import express from "express";
import TreatmentsHandler from "./handler";
import { RoutesProps } from "@/types";

export default function treatmentsRoutes({
  controller,
}: RoutesProps<TreatmentsHandler>) {
  const routes = express.Router();

  routes.get("/", controller.getTreatmentList);

  return routes;
}
