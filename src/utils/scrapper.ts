import { INotification } from "../models/notification.model";

export class ScrapperUtil {
  static scrapData(data: string, userStreet: string): INotification[] {
    var document = new DOMParser().parseFromString(data, "text/html");
    var elements = document.querySelectorAll(".mjesto, .vrijeme");

    const trimmedTexts: string[] = [];

    elements.forEach((el) => {
      if (el.textContent) {
        trimmedTexts.push(el.textContent.trim());
      }
    });

    let groupedValues = [];

    for (var i = 0, end = trimmedTexts.length / 2; i < end; ++i) {
      groupedValues.push(trimmedTexts.slice(i * 2, (i + 1) * 2));
    }

    return groupedValues.map((group) => {
      const streetIndexOf = group[0].indexOf("Ulica");
      const noteIndexOf = group[0].indexOf("Napomena");
      const reasonIndexOf = group[1].indexOf("Radovi");

      const noteStartIndex = noteIndexOf > 0 ? noteIndexOf : undefined;

      const street = group[0].substring(streetIndexOf, noteStartIndex);

      return {
        place: group[0].substring(0, streetIndexOf),
        street: street,
        isUserStreet:
          !!userStreet &&
          street.toLowerCase().includes(userStreet.toLowerCase()),
        note: noteStartIndex ? group[0].substring(noteStartIndex) : "",
        dateTime: group[1].substring(0, reasonIndexOf),
        reason: group[1].substring(reasonIndexOf),
      };
    });
  }
}
