import UpdatePatientEntities, {
  UpdatePatientPayload,
} from "@/src/infrastructure/repository/patients/entities/UpdatePatientEntities";
import PatientsRepository from "@/src/infrastructure/repository/patients/PatientsRepository";
import { BaseUseCasePayload } from "@/types";

export type UpdatePatientByIdUseCasePayload = {
  id: string;
  payload: UpdatePatientPayload;
} & BaseUseCasePayload;

type UpdatePatientByIdUseCaseProps = {
  patientsRepository: PatientsRepository;
};

export default class UpdatePatientByIdUseCase {
  public name: string;
  public _patientsRepository: UpdatePatientByIdUseCaseProps["patientsRepository"];

  constructor({ patientsRepository }: UpdatePatientByIdUseCaseProps) {
    this.name = "Update Patient UseCase";
    this._patientsRepository = patientsRepository;
  }

  async execute({ id, payload }: UpdatePatientByIdUseCasePayload) {
    const { payload: validPayload } = new UpdatePatientEntities(payload);

    const result = await this._patientsRepository.updatePatientById({
      payload: validPayload,
      id,
    });

    return result;
  }
}
