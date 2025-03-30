// @ts-nocheck
import express from "express";
import MedicationsHandler from "./handler";
import { RoutesProps } from "@/types";

export default function medicationsRoutes({
  controller,
}: RoutesProps<MedicationsHandler>) {
  const routes = express.Router();

  routes.get("/", controller.getMedicationList);

  return routes;
}
