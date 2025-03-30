import PatientsRepository from "@/src/infrastructure/repository/patients/PatientsRepository";
import { BaseUseCasePayload } from "@/types";

export type GetPatientByIdUseCasePayload = {
  id: string;
} & BaseUseCasePayload;

type GetPatientByIdUseCaseProps = {
  patientsRepository: PatientsRepository;
};

export default class GetPatientByIdUseCase {
  public name: string;
  public _patientsRepository: GetPatientByIdUseCaseProps["patientsRepository"];

  constructor({ patientsRepository }: GetPatientByIdUseCaseProps) {
    this.name = "Get Patient By ID UseCase";
    this._patientsRepository = patientsRepository;
  }

  async execute({ id }: GetPatientByIdUseCasePayload) {
    const result = await this._patientsRepository.getPatientById({
      id,
    });

    return result;
  }
}
