import GetPatientByIdUseCase, {
  GetPatientByIdUseCasePayload,
} from "@/src/applications/usecases/patients/GetPatientByIdUseCase";
import GetPatientListUseCase, {
  GetPatientListUseCasePayload,
} from "@/src/applications/usecases/patients/GetPatientListUseCase";
import { CustomRequest } from "@/types";
import autoBind from "auto-bind";
import { NextFunction, Response } from "express";

export type PatientsHandlerProps = {
  getPatientListUseCase: GetPatientListUseCase;
  getPatientByIdUseCase: GetPatientByIdUseCase;
};

export default class PatientsHandler {
  public _getPatientListUseCase: PatientsHandlerProps["getPatientListUseCase"];
  public _getPatientByIdUseCase: PatientsHandlerProps["getPatientByIdUseCase"];

  constructor({
    getPatientListUseCase,
    getPatientByIdUseCase,
  }: PatientsHandlerProps) {
    this._getPatientListUseCase = getPatientListUseCase;
    this._getPatientByIdUseCase = getPatientByIdUseCase;
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
}
