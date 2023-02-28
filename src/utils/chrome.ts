export class ChromeUtil {
  static getStatePreferences(
    setDistAreaCallback: (area: string) => void,
    setPlantCallback: (plant: string) => void,
    setStreetCallback: (street: string) => void
  ): void {
    chrome.storage.sync.get(
      {
        hepDistributionArea: "",
        hepPowerPlant: "",
        hepUserStreet: "",
      },
      (items) => {
        items.hepDistributionArea &&
          setDistAreaCallback(items.hepDistributionArea);
        items.hepUserStreet && setStreetCallback(items.hepUserStreet);
        items.hepPowerPlant && setPlantCallback(items.hepPowerPlant); // has to be last because of useEffect triggered on powerPlant change - TODO use one state as object
      }
    );
  }

  static savePreferences(area: string, plant: string, street: string): void {
    chrome.storage.sync.set({
      hepDistributionArea: area,
      hepPowerPlant: plant,
      hepUserStreet: street,
    });
  }

  static setBadgeText(text: string): void {
    chrome.action.setBadgeBackgroundColor({ color: "red" });
    chrome.action.setBadgeText({ text: text });
  }
}

// TODO - delete -> no need for util as the callbacks will not be the same
