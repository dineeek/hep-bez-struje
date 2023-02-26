import { DISTRIBUTION_AREAS } from "../meta/distribution-area";
import { IPowerPlant, POWER_PLANTS } from "../meta/power-plant";

export class MetaUtil {
  static getDistributionAreaPowerPlants(
    distributionArea: string
  ): IPowerPlant[] {
    const areaId = DISTRIBUTION_AREAS.find(
      (area) => area.value === distributionArea
    )?.id;

    return POWER_PLANTS.filter((plant) => plant.distributionAreaId === areaId);
  }

  static getDistributionAreaName(distributionArea: string): string {
    return (
      DISTRIBUTION_AREAS.find((area) => area.value === distributionArea)
        ?.name ?? ""
    );
  }

  static getPowerPlantName(powerPlant: string): string {
    return POWER_PLANTS.find((area) => area.value === powerPlant)?.name ?? "";
  }
}
