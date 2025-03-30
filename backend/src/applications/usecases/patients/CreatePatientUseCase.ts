import CreatePatientEntities, {
  CreatePatientPayload,
} from "@/src/infrastructure/repository/patients/entities/CreatePatientEntities";
import PatientsRepository from "@/src/infrastructure/repository/patients/PatientsRepository";
import { BaseUseCasePayload } from "@/types";

export type CreatePatientUseCasePayload = {
  payload: CreatePatientPayload;
} & BaseUseCasePayload;

type CreatePatientUseCaseProps = {
  patientsRepository: PatientsRepository;
};

export default class CreatePatientUseCase {
  public name: string;
  public _patientsRepository: CreatePatientUseCaseProps["patientsRepository"];

  constructor({ patientsRepository }: CreatePatientUseCaseProps) {
    this.name = "Create Patient UseCase";
    this._patientsRepository = patientsRepository;
  }

  async execute({ payload }: CreatePatientUseCasePayload) {
    const { payload: validPayload } = new CreatePatientEntities(payload);

    const result = await this._patientsRepository.createPatient({
      payload: validPayload,
    });

    return result;
  }
}
