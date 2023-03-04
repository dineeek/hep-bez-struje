import { INotification, IUserPreferences } from '../models';

const BASE_URL = 'https://www.hep.hr/ods/bez-struje/19';

enum SearchParams {
  DISTRIBUTION_AREA = 'dp',
  POWER_STATION = 'el',
  DATE = 'datum'
}

enum TextPatterns {
  PLACE = 'Mjesto: ',
  STREET = 'Ulica: ',
  NOTE = 'Napomena: ',
  TIME = 'Očekivano vrijeme: ',
  REASON = 'Radovi: '
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
    powerStation: string,
    date: string
  ): string {
    const url = new URL(BASE_URL);
    url.searchParams.append(SearchParams.DISTRIBUTION_AREA, distributionArea);
    url.searchParams.append(SearchParams.POWER_STATION, powerStation);
    url.searchParams.append(SearchParams.DATE, date.replace(/\s/g, ''));

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

      const searchDate = futureDate.toLocaleDateString('hr');

      const url = this.buildUrl(
        userPreferences.distributionArea,
        userPreferences.powerStation,
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
    const todayDate = new Date().toLocaleDateString('hr');

    const url = this.buildUrl(
      userPreferences.distributionArea,
      userPreferences.powerStation,
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
      .then(res => res.text())
      .then(response => this.scrapData(response, date, street));
  };

  private static scrapData(
    data: string,
    date: string,
    userStreet: string
  ): INotification[] {
    var document = new DOMParser().parseFromString(data, 'text/html');
    var elements = document.querySelectorAll('.mjesto, .vrijeme');

    const trimmedTexts: string[] = [];

    elements.forEach(el => {
      if (el.textContent) {
        trimmedTexts.push(el.textContent.trim());
      }
    });

    let groupedValues = [];

    // grouping every two elements together - they are splitted per selector classes
    for (var i = 0, end = trimmedTexts.length / 2; i < end; ++i) {
      groupedValues.push(trimmedTexts.slice(i * 2, (i + 1) * 2));
    }

    return groupedValues.map(([placeStreetNote, timeReason]) =>
      this.toNotification(placeStreetNote, timeReason, date, userStreet)
    );
  }

  private static toNotification = (
    placeStreetNote: string,
    timeReason: string,
    date: string,
    userStreet: string
  ): INotification => {
    const streetStartIndexOf = placeStreetNote.indexOf(TextPatterns.STREET);
    const noteIndexOf = placeStreetNote.indexOf(TextPatterns.NOTE);
    const reasonIndexOf = timeReason.indexOf(TextPatterns.REASON);

    const noteStartIndex = noteIndexOf > 0 ? noteIndexOf : undefined;

    const place = this.normalizeString(
      placeStreetNote.substring(TextPatterns.PLACE.length, streetStartIndexOf)
    );

    const street = this.normalizeString(
      placeStreetNote.substring(
        streetStartIndexOf + TextPatterns.STREET.length,
        noteStartIndex
      )
    );

    const isUserStreet =
      !!userStreet &&
      !!street &&
      street.toLowerCase().includes(userStreet.toLowerCase());

    const note = noteStartIndex
      ? this.normalizeString(
          placeStreetNote.substring(noteStartIndex + TextPatterns.NOTE.length)
        )
      : '';

    const time = this.normalizeString(
      timeReason.substring(TextPatterns.TIME.length, reasonIndexOf)
    );

    const reason = this.normalizeString(
      timeReason.substring(reasonIndexOf + TextPatterns.REASON.length)
    );

    return {
      date,
      place,
      street,
      isUserStreet,
      note,
      time,
      reason
    };
  };

  private static normalizeString(value: string): string {
    return value.replace(/(\r\n|\n|\t|\r)/gm, '').trim();
  }
}
