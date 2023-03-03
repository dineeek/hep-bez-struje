import { DISTRIBUTION_AREAS, POWER_STATIONS } from "../meta";
import { IUserPreferences } from "../models";
import { ScrapperUtil } from "../utils/scrapper";
import { HTML_DOCUMENT_MOCK, NOTIFICATIONS_MOCK } from "./__mocks__";

const USER_PREFERENCES_MOCK: IUserPreferences = {
  distributionArea: DISTRIBUTION_AREAS[0].value,
  powerStation: POWER_STATIONS[0].value,
  street: "",
  futureSearch: false,
};

const ALL_USER_PREFERENCES_MOCK: IUserPreferences = {
  ...USER_PREFERENCES_MOCK,
  street: "Trakošćanska",
  futureSearch: true,
};

describe("Scrapper util", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should build url per given params", () => {
    const url = ScrapperUtil["buildUrl"](
      USER_PREFERENCES_MOCK.distributionArea,
      USER_PREFERENCES_MOCK.powerStation,
      new Date("2023-03-01").toLocaleDateString("hr")
    );

    expect(decodeURI(url)).toEqual(
      "https://www.hep.hr/ods/bez-struje/19?dp=bjelovar&el=BJ&datum=01.03.2023."
    );
  });

  it("should fetch today's notifications", async () => {
    const urlBuilderSpy = jest.spyOn<any, any>(ScrapperUtil, "buildUrl");
    const fetchSpy = jest
      .spyOn<any, any>(ScrapperUtil, "fetchData")
      .mockResolvedValue([NOTIFICATIONS_MOCK[0]]);

    const todayDate = new Date();

    const notifications = await ScrapperUtil["getTodaysNotifications"](
      USER_PREFERENCES_MOCK
    );

    expect(urlBuilderSpy).toHaveBeenCalledTimes(1);
    expect(urlBuilderSpy).toHaveBeenLastCalledWith(
      USER_PREFERENCES_MOCK.distributionArea,
      USER_PREFERENCES_MOCK.powerStation,
      todayDate.toLocaleDateString("hr")
    );
    expect(fetchSpy).toBeCalledTimes(1);
    expect(notifications).toHaveLength(1);
  });

  it("should fetch today's and three days forward notifications", async () => {
    const urlBuilderSpy = jest.spyOn<any, any>(ScrapperUtil, "buildUrl");
    const fetchSpy = jest
      .spyOn<any, any>(ScrapperUtil, "fetchData")
      .mockResolvedValue([NOTIFICATIONS_MOCK[0]]);

    const todayDate = new Date();
    const expectedLastDate = new Date(todayDate);
    expectedLastDate.setDate(todayDate.getDate() + 3);

    const notifications = await ScrapperUtil["getFutureNotifications"](
      USER_PREFERENCES_MOCK
    );

    expect(urlBuilderSpy).toHaveBeenCalledTimes(4);
    expect(urlBuilderSpy).toHaveBeenLastCalledWith(
      USER_PREFERENCES_MOCK.distributionArea,
      USER_PREFERENCES_MOCK.powerStation,
      expectedLastDate.toLocaleDateString("hr")
    );
    expect(fetchSpy).toHaveBeenCalledTimes(4);
    expect(notifications).toHaveLength(4); // one response per request is mocked
  });

  it("should scrap notification data from raw html document", () => {
    const notifications = ScrapperUtil["scrapData"](
      HTML_DOCUMENT_MOCK,
      new Date("2023-03-01").toLocaleDateString("hr"),
      ALL_USER_PREFERENCES_MOCK.street
    );

    expect(notifications).toHaveLength(5);
    expect(
      notifications.some((notification) => notification.isUserStreet)
    ).toBeTruthy();

    expect(notifications).toEqual([
      {
        date: "01. 03. 2023.",
        time: "08:00 - 14:00",
        isUserStreet: false,
        note: "",
        place: "ZAGREB",
        reason: "planirani",
        street: "BADLJEVINSKI PUT, KUSTOŠIJANSKA 71",
      },
      {
        date: "01. 03. 2023.",
        time: "08:00 - 11:00",
        isUserStreet: false,
        note: "",
        place: "ZAGREB",
        reason: "planirani",
        street: "PUSTOSELINA 2-20 par, 1-9 nep",
      },
      {
        date: "01. 03. 2023.",
        time: "09:00 - 17:00",
        isUserStreet: true,
        note: "",
        place: "SESVETE",
        reason: "planirani",
        street:
          "TRAKOŠĆANSKA 36, KAŠINSKI ODVOJAK, KAŠINSKA 40/A, 40/B, 42-58 par, 29-55 nep",
      },
      {
        date: "01. 03. 2023.",
        time: "09:00 - 15:00",
        isUserStreet: false,
        note: "",
        place: "ZAGREB",
        reason: "planirani",
        street:
          "MATE UJEVIĆA 2-6 par, 1-7 nep, VLADIMIRA RUŽDJAKA 2/A, METELKOVA, BLAŽA LORKOVIĆA, JEĐUTOVA 2-10 par, 1-9 nep, HOTKO DRAGICE",
      },
      {
        date: "01. 03. 2023.",
        time: "08:30 - 11:30",
        isUserStreet: false,
        note: "",
        place: "ZAGREB",
        reason: "planirani",
        street:
          "ZORANIĆEVA, ULICA GRADA VUKOVARA 267, SUPILOVA 36, 23, RADNIČKA CESTA 36-40 par, MENČETIĆEVA 30, BUDMANIJEVA 2-do kraja par, 7-do kraja nep",
      },
    ]);
  });
});
