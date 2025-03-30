import CreatePatientUseCase, {
  CreatePatientUseCasePayload,
} from "@/src/applications/usecases/patients/CreatePatientUseCase";
import GetPatientByIdUseCase, {
  GetPatientByIdUseCasePayload,
} from "@/src/applications/usecases/patients/GetPatientByIdUseCase";
import GetPatientListUseCase, {
  GetPatientListUseCasePayload,
} from "@/src/applications/usecases/patients/GetPatientListUseCase";
import UpdatePatientByIdUseCase, {
  UpdatePatientByIdUseCasePayload,
} from "@/src/applications/usecases/patients/UpdatePatientByIdUseCase";
import { CustomRequest } from "@/types";
import autoBind from "auto-bind";
import { NextFunction, Response } from "express";

export type PatientsHandlerProps = {
  getPatientListUseCase: GetPatientListUseCase;
  getPatientByIdUseCase: GetPatientByIdUseCase;
  createPatientUseCase: CreatePatientUseCase;
  updatePatientByIdUseCase: UpdatePatientByIdUseCase;
};

export default class PatientsHandler {
  public _getPatientListUseCase: PatientsHandlerProps["getPatientListUseCase"];
  public _getPatientByIdUseCase: PatientsHandlerProps["getPatientByIdUseCase"];
  public _createPatientUseCase: PatientsHandlerProps["createPatientUseCase"];
  public _updatePatientByIdUseCase: PatientsHandlerProps["updatePatientByIdUseCase"];

  constructor({
    getPatientListUseCase,
    getPatientByIdUseCase,
    createPatientUseCase,
    updatePatientByIdUseCase,
  }: PatientsHandlerProps) {
    this._getPatientListUseCase = getPatientListUseCase;
    this._getPatientByIdUseCase = getPatientByIdUseCase;
    this._createPatientUseCase = createPatientUseCase;
    this._updatePatientByIdUseCase = updatePatientByIdUseCase;
    autoBind(this);
  }

  async getPatientList(
    request: CustomRequest,
    response: Response,
    _next: NextFunction
  ) {
    const queryParams =
      request.query as GetPatientListUseCasePayload["queryParams"];
    const useCasePayload: GetPatientListUseCasePayload = {
      credentials: request.credentials,
      queryParams,
    };

    const { data, metadata } = await this._getPatientListUseCase.execute(
      useCasePayload
    );

    return response.status(200).json({
      success: true,
      message: "Patient List data retrieved successfully",
      data,
      metadata,
    });
  }

  async getPatientById(
    request: CustomRequest,
    response: Response,
    _next: NextFunction
  ) {
    const useCasePayload: GetPatientByIdUseCasePayload = {
      credentials: request.credentials,
      id: request.params.id,
    };

    const data = await this._getPatientByIdUseCase.execute(useCasePayload);

    return response.status(200).json({
      success: true,
      message: "Patient data retrieved successfully",
      data,
    });
  }

  async createPatient(
    request: CustomRequest,
    response: Response,
    _next: NextFunction
  ) {
    const payload = request.body as CreatePatientUseCasePayload["payload"];
    const useCasePayload: CreatePatientUseCasePayload = {
      credentials: request.credentials,
      payload,
    };

    const data = await this._createPatientUseCase.execute(useCasePayload);

    return response.status(200).json({
      success: true,
      message: "Patient data created successfully",
      data,
    });
  }

  async updatePatient(
    request: CustomRequest,
    response: Response,
    _next: NextFunction
  ) {
    const payload = request.body as UpdatePatientByIdUseCasePayload["payload"];
    const useCasePayload: UpdatePatientByIdUseCasePayload = {
      credentials: request.credentials,
      payload,
      id: request.params.id,
    };

    const data = await this._updatePatientByIdUseCase.execute(useCasePayload);

    return response.status(200).json({
      success: true,
      message: "Patient data updated successfully",
      data,
    });
  }
}
