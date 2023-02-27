const BASE_URL = "https://www.hep.hr/ods/bez-struje/19";

enum SearchParams {
  DISTRIBUTION_AREA = "dp",
  POWER_PLANT = "el",
  DATE = "datum", // format: 25.02.2023
}

export class URLBuilderUtil {
  static build(
    distributionArea: string,
    powerPlant: string,
    date: string
  ): string {
    const url = new URL(BASE_URL);
    url.searchParams.append(SearchParams.DISTRIBUTION_AREA, distributionArea);
    url.searchParams.append(SearchParams.POWER_PLANT, powerPlant);
    url.searchParams.append(SearchParams.DATE, date);

    return url.href;
  }
}
