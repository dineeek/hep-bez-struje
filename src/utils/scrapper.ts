import { INotification } from "../models/notification.model";

export class ScrapperUtil {
  static scrapData(data: string, date: string): INotification[] {
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

      const placeEndIndex = streetIndexOf > 0 ? streetIndexOf : undefined;
      const noteStartIndex = noteIndexOf > 0 ? noteIndexOf : undefined;
      const reasonStartIndex = reasonIndexOf > 0 ? reasonIndexOf : undefined;

      return {
        place: group[0].substring(0, placeEndIndex),
        street: group[0].substring(placeEndIndex ?? 0, noteStartIndex),
        note: noteStartIndex ? group[0].substring(noteStartIndex) : "",
        dateTime: group[1].substring(0, reasonStartIndex),
        reason: group[1].substring(reasonStartIndex ?? 0),
      };
    });
  }
}
