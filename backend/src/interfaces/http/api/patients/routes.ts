// @ts-nocheck
import express from "express";
import PatientsHandler from "./handler";
import { RoutesProps } from "@/types";

export default function patientsRoutes({
  controller,
}: RoutesProps<PatientsHandler>) {
  const routes = express.Router();

  routes.get("/", controller.getPatientList);
  routes.get("/:id", controller.getPatientById);

  return routes;
}
