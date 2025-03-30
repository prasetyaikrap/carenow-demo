import InvariantError from "@/src/commons/exceptions/InvariantError";
import { match, P } from "ts-pattern";

export type CreatePatientPayload = {
  id: string;
  name: string;
  treatment_date: string;
  treatment_description: {
    value: string;
    label: string;
  }[];
  medication_prescribed: {
    value: string;
    label: string;
  }[];
  cost_of_treatment: number;
};

export default class CreatePatientEntities {
  public payload: CreatePatientPayload;

  constructor(payload: CreatePatientPayload) {
    this._verifyPayload(payload);
    const {
      id,
      name,
      treatment_date,
      treatment_description,
      medication_prescribed,
      cost_of_treatment,
    } = payload;

    this.payload = {
      id,
      name,
      treatment_date,
      treatment_description,
      medication_prescribed,
      cost_of_treatment,
    };
  }

  _verifyPayload(payload: CreatePatientPayload) {
    match(payload)
      .with(
        {
          id: P.not(P.string.minLength(1)),
          name: P.not(P.string.minLength(1)),
          treatment_date: P.not(P.string.minLength(1)),
          cost_of_treatment: P.not(P.number.gt(0)),
          treatment_description: P.not(
            P.array({ value: P.string, label: P.string })
          ),
          medication_prescribed: P.not(
            P.array({ value: P.string, label: P.string })
          ),
        },
        () => {
          throw new InvariantError("Create Patient Failed. Invalid Payload");
        }
      )
      .otherwise(() => {});
  }
}
