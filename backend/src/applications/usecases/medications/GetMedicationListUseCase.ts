import { generateFilters } from "@/src/commons/utils/general";
import QueryPagination, {
  QueryPaginationPayload,
} from "@/src/infrastructure/repository/general/entities/QueryPagination";
import MedicationsRepository from "@/src/infrastructure/repository/medications/MedicationsRepository";
import { BaseUseCasePayload } from "@/types";

export type GetMedicationListUseCasePayload = {
  queryParams: QueryPaginationPayload;
} & BaseUseCasePayload;

type GetMedicationListUseCaseProps = {
  medicationsRepository: MedicationsRepository;
};

export default class GetMedicationListUseCase {
  public name: string;
  public _medicationsRepository: GetMedicationListUseCaseProps["medicationsRepository"];

  constructor({ medicationsRepository }: GetMedicationListUseCaseProps) {
    this.name = "Get Medications List UseCase";
    this._medicationsRepository = medicationsRepository;
  }

  async execute({ queryParams }: GetMedicationListUseCasePayload) {
    const { queries, _page, _limit, _sort } = new QueryPagination({
      payload: queryParams,
      keys: ["label:label__contains"],
    });

    const orders = _sort.split(",");

    const filters = generateFilters(queries);

    const result = await this._medicationsRepository.getMedicationsList({
      filters,
      orders,
      page: _page,
      limit: _limit,
    });

    return result;
  }
}
