import { DISTRIBUTION_AREAS } from "../meta/distribution-area";

export class ChromeUtil {
  static getStatePreferences(
    setDistAreaCallback: (area: string) => void,
    setPlantCallback: (plant: string) => void
  ): void {
    chrome.storage.sync.get(
      {
        hepDistributionArea: "", // use first of list as default
        hepPowerPlant: "",
      },
      (items) => {
        items.hepDistributionArea &&
          setDistAreaCallback(items.hepDistributionArea);
        items.hepPowerPlant && setPlantCallback(items.hepPowerPlant);
      }
    );
  }

  static savePreferences(
    area: string,
    plant: string,
    saveCallback: () => void
  ): void {
    // Saves options to chrome.storage.sync
    chrome.storage.sync.set(
      {
        hepDistributionArea: area,
        hepPowerPlant: plant,
      },
      () => {
        return saveCallback();
      }
    );
  }

  static setBadgeText(text: string): void {
    chrome.action.setBadgeText({ text: text });
  }
}
