import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { DISTRIBUTION_AREAS } from "../meta/distribution-area";
import { IPowerPlant, POWER_PLANTS } from "../meta/power-plant";
import { optionUiStyle } from "./option.ui.style";

const Options = () => {
  const [distributionArea, setDistributionArea] = useState<string>("");
  const [powerPlant, setPowerPlant] = useState<string>("");
  const [distAreaPowerPlants, setDistAreaPowerPlants] = useState<IPowerPlant[]>(
    []
  );
  const [saveStatus, setSaveStatus] = useState<string>("");

  useEffect(() => {
    // Restores select box and checkbox state using the preferences stored in chrome.storage
    chrome.storage.sync.get(
      {
        hepDistributionArea: DISTRIBUTION_AREAS[0].value, // use first of list as default
        hepPowerPlant: "",
      },
      (items) => {
        onDistributionAreaChange(items.hepDistributionArea);
        items.hepPowerPlant && setPowerPlant(items.hepPowerPlant);
      }
    );
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

    // Saves options to chrome.storage.sync
    chrome.storage.sync.set(
      {
        hepDistributionArea: distributionArea,
        hepPowerPlant: powerPlant,
      },
      () => {
        return showStatus("Vrijednosti su spremljene.");
      }
    );
  };

  return (
    <>
      <div style={optionUiStyle.container}>
        <div style={optionUiStyle.selection}>
          Distribucijsko područje:
          <select
            style={optionUiStyle.select}
            value={distributionArea}
            onChange={(event) => onDistributionAreaChange(event.target.value)}
          >
            {getAreaOptions()}
          </select>
        </div>

        <div style={optionUiStyle.selection}>
          Pogon:
          <select
            style={optionUiStyle.select}
            value={powerPlant}
            onChange={(event) => setPowerPlant(event.target.value)}
          >
            <option defaultValue="none" hidden></option>
            {getPlantOptions()}
          </select>
        </div>

        <div style={optionUiStyle.actions}>
          <span style={optionUiStyle.darkColor}>{saveStatus}</span>
          <button style={optionUiStyle.saveButton} onClick={saveOptions}>
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
