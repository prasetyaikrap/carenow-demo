import GetTreatmentListUseCase, {
  GetTreatmentListUseCasePayload,
} from "@/src/applications/usecases/treatments/GetTreatmentListUseCase";
import { CustomRequest } from "@/types";
import autoBind from "auto-bind";
import { NextFunction, Response } from "express";

export type TreatmentsHandlerProps = {
  getTreatmentListUseCase: GetTreatmentListUseCase;
};

export default class TreatmentsHandler {
  public _getTreatmentListUseCase: TreatmentsHandlerProps["getTreatmentListUseCase"];

  constructor({ getTreatmentListUseCase }: TreatmentsHandlerProps) {
    this._getTreatmentListUseCase = getTreatmentListUseCase;
    autoBind(this);
  }

  async getTreatmentList(
    request: CustomRequest,
    response: Response,
    _next: NextFunction
  ) {
    const queryParams =
      request.query as GetTreatmentListUseCasePayload["queryParams"];
    const useCasePayload: GetTreatmentListUseCasePayload = {
      credentials: request.credentials,
      queryParams,
    };

    const { data, metadata } = await this._getTreatmentListUseCase.execute(
      useCasePayload
    );

    return response.status(200).json({
      success: true,
      message: "Treatment List data retrieved successfully",
      data,
      metadata,
    });
  }
}
