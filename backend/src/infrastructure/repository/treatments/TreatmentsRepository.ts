type GetTreatmentListProps = {};

export default class TreatmentsRepository {
  public name: string;

  constructor() {
    this.name = "Treatments Repository";
  }

  async getTreatmentList({}: GetTreatmentListProps) {}
}
