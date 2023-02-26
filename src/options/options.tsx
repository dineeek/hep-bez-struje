import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { DISTRIBUTION_AREAS } from "../meta/distribution-area";
import { IPowerPlant, POWER_PLANTS } from "../meta/power-plant";
import { ChromeStorage } from "../utils/chrome-storage";
import { optionsStyle } from "./options-style";

const Options = () => {
  const [distributionArea, setDistributionArea] = useState<string>("");
  const [powerPlant, setPowerPlant] = useState<string>("");
  const [distAreaPowerPlants, setDistAreaPowerPlants] = useState<IPowerPlant[]>(
    []
  );
  const [saveStatus, setSaveStatus] = useState<string>("");

  useEffect(() => {
    // Restores select box and checkbox state using the preferences stored in chrome.storage
    ChromeStorage.getStatePreferences(onDistributionAreaChange, setPowerPlant);
  }, []);

  const onDistributionAreaChange = (distArea: string): void => {
    setDistributionArea(distArea);

    const areaId = DISTRIBUTION_AREAS.find(
      (area) => area.value === distArea
    )?.id;

    const powerPlants = POWER_PLANTS.filter(
      (plant) => plant.distributionAreaId === areaId
    );

    setDistAreaPowerPlants(powerPlants);
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
      return showStatus("Odaberite područje i pogon.");
    }

    ChromeStorage.savePreferences(
      distributionArea,
      powerPlant,
      showStatus("Vrijednosti su spremljene.")
    );
  };

  return (
    <>
      <div style={optionsStyle.container}>
        <div style={optionsStyle.selection}>
          Distribucijsko područje:
          <select
            style={optionsStyle.select}
            value={distributionArea}
            onChange={(event) => onDistributionAreaChange(event.target.value)}
          >
            {getAreaOptions()}
          </select>
        </div>

        <div style={optionsStyle.selection}>
          Pogon:
          <select
            style={optionsStyle.select}
            value={powerPlant}
            onChange={(event) => setPowerPlant(event.target.value)}
          >
            <option defaultValue="none" hidden></option>
            {getPlantOptions()}
          </select>
        </div>

        <div style={optionsStyle.actions}>
          <span style={optionsStyle.darkColor}>{saveStatus}</span>
          <button style={optionsStyle.saveButton} onClick={saveOptions}>
            Spremi
          </button>
        </div>
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
