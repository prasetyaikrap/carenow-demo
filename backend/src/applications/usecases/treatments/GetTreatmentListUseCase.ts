import { generateFilters } from "@/src/commons/utils/general";
import QueryPagination, {
  QueryPaginationPayload,
} from "@/src/infrastructure/repository/general/entities/QueryPagination";
import TreatmentsRepository from "@/src/infrastructure/repository/treatments/TreatmentsRepository";
import { BaseUseCasePayload } from "@/types";

export type GetTreatmentListUseCasePayload = {
  queryParams: QueryPaginationPayload;
} & BaseUseCasePayload;

type GetTreatmentListUseCaseProps = {
  treatmentsRepository: TreatmentsRepository;
};

export default class GetTreatmentListUseCase {
  public name: string;
  public _treatmentsRepository: GetTreatmentListUseCaseProps["treatmentsRepository"];

  constructor({ treatmentsRepository }: GetTreatmentListUseCaseProps) {
    this.name = "Get Treatment List UseCase";
    this._treatmentsRepository = treatmentsRepository;
  }

  async execute({ queryParams }: GetTreatmentListUseCasePayload) {
    const { queries, _page, _limit, _sort } = new QueryPagination({
      payload: queryParams,
      keys: ["label:label__contains"],
    });

    const orders = _sort.split(",");

    const filters = generateFilters(queries);

    const result = await this._treatmentsRepository.getTreatmentList({
      filters,
      orders,
      page: _page,
      limit: _limit,
    });

    return result;
  }
}
