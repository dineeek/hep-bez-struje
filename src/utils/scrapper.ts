import { INotification, IUserPreferences } from "../models";

const BASE_URL = "https://www.hep.hr/ods/bez-struje/19";

enum SearchParams {
  DISTRIBUTION_AREA = "dp",
  POWER_PLANT = "el",
  DATE = "datum",
}

export class ScrapperUtil {
  static getNotifications(
    userPreferences: IUserPreferences
  ): Promise<INotification[]> {
    if (userPreferences.futureSearch) {
      return this.getFutureNotifications(userPreferences);
    }

    return this.getTodaysNotifications(userPreferences);
  }

  private static buildUrl(
    distributionArea: string,
    powerPlant: string,
    date: string
  ): string {
    const url = new URL(BASE_URL);
    url.searchParams.append(SearchParams.DISTRIBUTION_AREA, distributionArea);
    url.searchParams.append(SearchParams.POWER_PLANT, powerPlant);
    url.searchParams.append(SearchParams.DATE, date.replace(/\s/g, ""));

    return url.href;
  }

  // HEP is providing only three days forward information
  private static getFutureNotifications = async (
    userPreferences: IUserPreferences
  ): Promise<INotification[]> => {
    const notificationPromises = [];
    // index is number of day to add
    for (let i = 0; i < 4; i++) {
      const todayDate = new Date();
      const futureDate = new Date(todayDate);
      futureDate.setDate(todayDate.getDate() + i);

      const searchDate = futureDate.toLocaleDateString("hr");

      const url = this.buildUrl(
        userPreferences.distributionArea,
        userPreferences.powerPlant,
        searchDate
      );

      notificationPromises.push(
        this.fetchData(url, searchDate, userPreferences.street)
      );
    }

    let notifications: INotification[] = [];

    for (const notificationPromise of notificationPromises) {
      notifications = [...notifications, ...(await notificationPromise)];
    }

    return notifications;
  };

  private static getTodaysNotifications = (
    userPreferences: IUserPreferences
  ): Promise<INotification[]> => {
    const todayDate = new Date().toLocaleDateString("hr");

    const url = this.buildUrl(
      userPreferences.distributionArea,
      userPreferences.powerPlant,
      todayDate
    );

    return this.fetchData(url, todayDate, userPreferences.street);
  };

  private static fetchData = (
    url: string,
    date: string,
    street: string
  ): Promise<INotification[]> => {
    return fetch(url)
      .then((res) => res.text())
      .then((response) => this.scrapData(response, date, street));
  };

  private static scrapData(
    data: string,
    date: string,
    userStreet: string
  ): INotification[] {
    var document = new DOMParser().parseFromString(data, "text/html");
    var elements = document.querySelectorAll(".mjesto, .vrijeme");

    const trimmedTexts: string[] = [];

    elements.forEach((el) => {
      if (el.textContent) {
        trimmedTexts.push(el.textContent.trim());
      }
    });

    let groupedValues = [];

    // grouping every two elements together - they are splitted per selector classes
    for (var i = 0, end = trimmedTexts.length / 2; i < end; ++i) {
      groupedValues.push(trimmedTexts.slice(i * 2, (i + 1) * 2));
    }

    return groupedValues.map(([mjesto, vrijeme]) => {
      const streetIndexOf = mjesto.indexOf("Ulica");
      const noteIndexOf = mjesto.indexOf("Napomena");
      const reasonIndexOf = vrijeme.indexOf("Radovi");

      const noteStartIndex = noteIndexOf > 0 ? noteIndexOf : undefined;

      const street = this.normalizeString(
        mjesto.substring(streetIndexOf, noteStartIndex)
      );

      return {
        date,
        place: this.normalizeString(mjesto.substring(0, streetIndexOf)),
        street: street,
        isUserStreet:
          !!userStreet &&
          street.toLowerCase().includes(userStreet.toLowerCase()),
        note: noteStartIndex
          ? this.normalizeString(mjesto.substring(noteStartIndex))
          : "",
        dateTime: this.normalizeString(vrijeme.substring(0, reasonIndexOf)),
        reason: this.normalizeString(vrijeme.substring(reasonIndexOf)),
      };
    });
  }

  private static normalizeString(value: string): string {
    return value.replace(/(\r\n|\n|\t|\r)/gm, "").trim();
  }
}
