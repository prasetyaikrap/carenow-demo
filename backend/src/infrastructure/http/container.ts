import "express-async-errors";

import express from "express";
import cors from "cors";
import errorHandlerMiddleware from "../../interfaces/middleware/errorHandlerMiddleware";
import initPostgresql from "@/src/commons/databases/postgres";
import PatientsRepository from "../repository/patients/PatientsRepository";
import GetPatientListUseCase from "@/src/applications/usecases/patients/GetPatientListUseCase";
import patientsRoutes from "@/src/interfaces/http/api/patients/routes";
import PatientsHandler from "@/src/interfaces/http/api/patients/handler";
import GetPatientByIdUseCase from "@/src/applications/usecases/patients/GetPatientByIdUseCase";
import TreatmentsRepository from "../repository/treatments/TreatmentsRepository";
import GetTreatmentListUseCase from "@/src/applications/usecases/treatments/GetTreatmentListUseCase";
import treatmentsRoutes from "@/src/interfaces/http/api/treatments/routes";
import TreatmentsHandler from "@/src/interfaces/http/api/treatments/handler";
import MedicationsRepository from "../repository/medications/MedicationsRepository";
import GetMedicationListUseCase from "@/src/applications/usecases/medications/GetMedicationListUseCase";
import medicationsRoutes from "@/src/interfaces/http/api/medications/routes";
import MedicationsHandler from "@/src/interfaces/http/api/medications/handler";

export default function createApp() {
  // database
  const appPostgresInstance = initPostgresql();
  // Repositories
  const patientsRepository = new PatientsRepository({ appPostgresInstance });
  const treatmentsRepository = new TreatmentsRepository({
    appPostgresInstance,
  });
  const medicationsRepository = new MedicationsRepository({
    appPostgresInstance,
  });

  // Usecases
  const patientsUseCase = {
    getPatientListUseCase: new GetPatientListUseCase({ patientsRepository }),
    getPatientByIdUseCase: new GetPatientByIdUseCase({ patientsRepository }),
  };
  const treatmentsUseCase = {
    getTreatmentListUseCase: new GetTreatmentListUseCase({
      treatmentsRepository,
    }),
  };
  const medicationsUseCase = {
    getMedicationListUseCase: new GetMedicationListUseCase({
      medicationsRepository,
    }),
  };

  // Middleware

  // Router Handler
  const patientsRouter = patientsRoutes({
    controller: new PatientsHandler(patientsUseCase),
  });
  const treatmentsRouter = treatmentsRoutes({
    controller: new TreatmentsHandler(treatmentsUseCase),
  });
  const medicationsRouter = medicationsRoutes({
    controller: new MedicationsHandler(medicationsUseCase),
  });

  // Initialize App
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.get("/", (_req, res) => {
    res.json({ message: "CareNow Demo - Prasetya Ikra Priyadi" });
  });

  app.use("/v1/patients", patientsRouter);
  app.use("/v1/treatments", treatmentsRouter);
  app.use("/v1/medications", medicationsRouter);

  // Error Handling
  //@ts-ignore
  app.use(errorHandlerMiddleware);

  return app;
}
