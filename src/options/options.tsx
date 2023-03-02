import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { DISTRIBUTION_AREAS, IPowerPlant } from "../meta";
import { ChromeStorage } from "../models";
import { MetaUtil } from "../utils";
import "./options.css";

const Options = () => {
  const [distributionArea, setDistributionArea] = useState<string>("");
  const [powerPlant, setPowerPlant] = useState<string>("");
  const [distAreaPowerPlants, setDistAreaPowerPlants] = useState<IPowerPlant[]>(
    []
  );
  const [street, setStreet] = useState<string>("");
  const [futureSearch, setFutureSearch] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>("");

  useEffect(() => {
    chrome.storage.sync.get(
      {
        [ChromeStorage.DISTRIBUTION_AREA]: "",
        [ChromeStorage.POWER_PLANT]: "",
        [ChromeStorage.USER_STREET]: "",
        [ChromeStorage.FUTURE_SEARCH]: false,
      },
      (storage) => {
        onDistributionAreaChange(storage[ChromeStorage.DISTRIBUTION_AREA]);
        setPowerPlant(storage[ChromeStorage.POWER_PLANT]);
        setStreet(storage[ChromeStorage.USER_STREET]);
        setFutureSearch(storage[ChromeStorage.FUTURE_SEARCH]);
      }
    );
  }, []);

  const onDistributionAreaChange = (areaValue: string): void => {
    setDistributionArea(areaValue);
    setPowerPlant("");
    setStreet("");
    setFutureSearch(false);
    setDistAreaPowerPlants(MetaUtil.getDistributionAreaPowerPlants(areaValue));
  };

  const getAreaOptions = () => {
    return DISTRIBUTION_AREAS.map((area) => (
      <option key={area.value} value={area.value}>
        {area.name}
      </option>
    ));
  };

  const getPlantOptions = () => {
    return distAreaPowerPlants.map((plant) => {
      return (
        <option key={plant.value} value={plant.value}>
          {plant.name}
        </option>
      );
    });
  };

  const showStatus = (message: string) => {
    setSaveStatus(message);

    const id = setTimeout(() => {
      setSaveStatus("");
    }, 2000);
    return () => clearTimeout(id);
  };

  const saveOptions = () => {
    if (!distributionArea || !powerPlant) {
      showStatus("Odaberite područje i pogon.");
      return;
    }

    chrome.storage.sync.set({
      [ChromeStorage.DISTRIBUTION_AREA]: distributionArea,
      [ChromeStorage.POWER_PLANT]: powerPlant,
      [ChromeStorage.USER_STREET]: street,
      [ChromeStorage.FUTURE_SEARCH]: futureSearch,
    });

    showStatus("Vrijednosti su spremljene.");
  };

  return (
    <>
      <div className="container">
        <div className="selection">
          Distribucijsko područje:
          <select
            className="select-input"
            value={distributionArea}
            onChange={(event) => onDistributionAreaChange(event.target.value)}
          >
            <option defaultValue="none" hidden></option>
            {getAreaOptions()}
          </select>
        </div>

        {distributionArea && (
          <div className="selection">
            Pogon:
            <select
              className="select-input"
              value={powerPlant}
              onChange={(event) => setPowerPlant(event.target.value)}
            >
              <option defaultValue="none" hidden></option>
              {getPlantOptions()}
            </select>
          </div>
        )}

        {distributionArea && powerPlant && (
          <>
            <div className="selection">
              Moja ulica:
              <input
                className="select-input"
                type="text"
                onChange={(event) => setStreet(event.target.value)}
                placeholder="Opcionalno - npr. Vukovarska"
                value={street}
              />
            </div>

            <div className="checkbox">
              Provjeri tri dana unaprijed:
              <input
                className="check-input"
                type="checkbox"
                checked={futureSearch}
                onChange={() => setFutureSearch(!futureSearch)}
              />
            </div>

            <div className="actions">
              <span className="darkColor">{saveStatus}</span>
              <button
                type="submit"
                className="save-button"
                onClick={saveOptions}
              >
                Spremi
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById("root")
);
