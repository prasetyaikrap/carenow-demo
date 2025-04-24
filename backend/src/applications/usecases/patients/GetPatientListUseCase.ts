import { generateFilters } from "@/src/commons/utils/general";
import QueryPagination, {
  QueryPaginationPayload,
} from "@/src/infrastructure/repository/general/entities/QueryPagination";
import PatientsRepository from "@/src/infrastructure/repository/patients/PatientsRepository";
import { BaseUseCasePayload } from "@/types";

export type GetPatientListUseCasePayload = {
  queryParams: QueryPaginationPayload;
} & BaseUseCasePayload;

type GetPatientListUseCaseProps = {
  patientsRepository: PatientsRepository;
};

export default class GetPatientListUseCase {
  public name: string;
  public _patientsRepository: GetPatientListUseCaseProps["patientsRepository"];

  constructor({ patientsRepository }: GetPatientListUseCaseProps) {
    this.name = "Get Patient List UseCase";
    this._patientsRepository = patientsRepository;
  }

  async execute({ queryParams }: GetPatientListUseCasePayload) {
    const { queries, _page, _limit, _sort } = new QueryPagination({
      payload: queryParams,
      keys: [
        "name:name__contains",
        "treatment:treatments.label__havingArrayToStringContains",
      ],
    });

    const orders = _sort.split(",");

    const filters = generateFilters(queries);

    const { data, metadata } = await this._patientsRepository.getPatientList({
      filters,
      orders,
      page: _page,
      limit: _limit,
    });

    return {
      data: data.map((d) => ({
        ...d,
        treatment_description: d.treatment_description.filter(
          (td, index, self) =>
            td.value !== null &&
            index === self.findIndex((t) => t.value === td.value)
        ),
        medication_prescribed: d.medication_prescribed.filter(
          (mp, index, self) =>
            mp.value !== null &&
            index === self.findIndex((t) => t.value === mp.value)
        ),
      })),
      metadata,
    };
  }
}
