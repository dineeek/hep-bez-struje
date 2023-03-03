import { DISTRIBUTION_AREAS, POWER_PLANTS } from "../meta";
import { MetaUtil } from "../utils";

describe("Meta util", () => {
  let RANDOM_INDEX = 0;

  beforeEach(() => {
    RANDOM_INDEX = Math.floor(Math.random() * 10);
  });

  it("should get power plants for specific distribution area", () => {
    expect(
      MetaUtil.getDistributionAreaPowerPlants(
        DISTRIBUTION_AREAS[RANDOM_INDEX].value
      )
    ).toEqual(
      POWER_PLANTS.filter(
        (plant) =>
          plant.distributionAreaId === DISTRIBUTION_AREAS[RANDOM_INDEX].id
      )
    );
  });

  it("should get distribution area name", () => {
    expect(
      MetaUtil.getDistributionAreaName(DISTRIBUTION_AREAS[RANDOM_INDEX].value)
    ).toBe(DISTRIBUTION_AREAS[RANDOM_INDEX].name);
  });

  it("should get power plant name", () => {
    expect(MetaUtil.getPowerPlantName(POWER_PLANTS[RANDOM_INDEX].value)).toBe(
      POWER_PLANTS[RANDOM_INDEX].name
    );
  });
});
