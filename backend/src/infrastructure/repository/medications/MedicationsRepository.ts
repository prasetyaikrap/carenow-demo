type GetMedicationListProps = {};

export default class MedicationsRepository {
  public name: string;

  constructor() {
    this.name = "Medications Repository";
  }

  async getMedicationList({}: GetMedicationListProps) {}
}
