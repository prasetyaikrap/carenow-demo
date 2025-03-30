import GetMedicationListUseCase, {
  GetMedicationListUseCasePayload,
} from "@/src/applications/usecases/medications/GetMedicationListUseCase";

import { CustomRequest } from "@/types";
import autoBind from "auto-bind";
import { NextFunction, Response } from "express";

export type MedicationsHandlerProps = {
  getMedicationListUseCase: GetMedicationListUseCase;
};

export default class MedicationsHandler {
  public _getMedicationListUseCase: MedicationsHandlerProps["getMedicationListUseCase"];

  constructor({ getMedicationListUseCase }: MedicationsHandlerProps) {
    this._getMedicationListUseCase = getMedicationListUseCase;
    autoBind(this);
  }

  async getMedicationList(
    request: CustomRequest,
    response: Response,
    _next: NextFunction
  ) {
    const queryParams =
      request.query as GetMedicationListUseCasePayload["queryParams"];
    const useCasePayload: GetMedicationListUseCasePayload = {
      credentials: request.credentials,
      queryParams,
    };

    const { data, metadata } = await this._getMedicationListUseCase.execute(
      useCasePayload
    );

    return response.status(200).json({
      success: true,
      message: "Medication List data retrieved successfully",
      data,
      metadata,
    });
  }
}
