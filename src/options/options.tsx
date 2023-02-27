import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { DISTRIBUTION_AREAS, IPowerPlant } from "../meta";
import { ChromeUtil, MetaUtil } from "../utils";
import "./options.css";

const Options = () => {
  const [distributionArea, setDistributionArea] = useState<string>("");
  const [powerPlant, setPowerPlant] = useState<string>("");
  const [distAreaPowerPlants, setDistAreaPowerPlants] = useState<IPowerPlant[]>(
    []
  );
  const [saveStatus, setSaveStatus] = useState<string>("");

  useEffect(() => {
    // Restores select box and checkbox state using the preferences stored in chrome.storage
    ChromeUtil.getStatePreferences(onDistributionAreaChange, setPowerPlant);
  }, []);

  const onDistributionAreaChange = (areaValue: string): void => {
    setDistributionArea(areaValue);
    setPowerPlant("");
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

    ChromeUtil.savePreferences(distributionArea, powerPlant);
    showStatus("Vrijednosti su spremljene.");
  };

  return (
    <>
      <div className="container">
        <div className="selection">
          Distribucijsko područje:
          <select
            className="select"
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
              className="select"
              value={powerPlant}
              onChange={(event) => setPowerPlant(event.target.value)}
            >
              <option defaultValue="none" hidden></option>
              {getPlantOptions()}
            </select>
          </div>
        )}

        {distributionArea && powerPlant && (
          <div className="actions">
            <span className="darkColor">{saveStatus}</span>
            <button className="saveButton" onClick={saveOptions}>
              Spremi
            </button>
          </div>
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
