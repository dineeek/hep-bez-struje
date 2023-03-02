import { DISTRIBUTION_AREAS, POWER_PLANTS } from "../meta";
import { IUserPreferences } from "../models";
import { ScrapperUtil } from "../utils/scrapper";
import { documentMock } from "./mocks";

const USER_PREFERENCES_MOCK: IUserPreferences = {
  distributionArea: DISTRIBUTION_AREAS[0].value,
  powerPlant: POWER_PLANTS[0].value,
  street: "",
  futureSearch: false,
};

describe("Scrapper util", () => {
  it("should build url per given params", () => {
    const date = new Date("2023-03-01").toLocaleDateString("hr");
    const url = ScrapperUtil["buildUrl"](
      DISTRIBUTION_AREAS[0].value,
      POWER_PLANTS[0].value,
      new Date("2023-03-01").toLocaleDateString("hr")
    );

    expect(decodeURI(url)).toEqual(
      "https://www.hep.hr/ods/bez-struje/19?dp=bjelovar&el=BJ&datum=01.03.2023."
    );
  });

  it("should scrap notification data from raw HTML document", () => {
    const notifications = ScrapperUtil["scrapData"](
      documentMock,
      new Date("2023-03-01").toLocaleDateString("hr"),
      ""
    );

    expect(notifications).toHaveLength(2);
  });
  it("should xy", () => {});
});
