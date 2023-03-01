import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { DISTRIBUTION_AREAS, IPowerPlant } from "../meta";
import { MetaUtil } from "../utils";
import "./options.css";

const Options = () => {
  const [distributionArea, setDistributionArea] = useState<string>("");
  const [powerPlant, setPowerPlant] = useState<string>("");
  const [distAreaPowerPlants, setDistAreaPowerPlants] = useState<IPowerPlant[]>(
    []
  );
  const [street, setStreet] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<string>("");

  useEffect(() => {
    chrome.storage.sync.get(
      {
        hepDistributionArea: "",
        hepPowerPlant: "",
        hepUserStreet: "",
      },
      (items) => {
        items.hepDistributionArea &&
          onDistributionAreaChange(items.hepDistributionArea);
        items.hepPowerPlant && setPowerPlant(items.hepPowerPlant);
        items.hepUserStreet && setStreet(items.hepUserStreet);
      }
    );
  }, []);

  const onDistributionAreaChange = (areaValue: string): void => {
    setDistributionArea(areaValue);
    setPowerPlant("");
    setStreet("");
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
      hepDistributionArea: distributionArea,
      hepPowerPlant: powerPlant,
      hepUserStreet: street,
    });
    showStatus("Vrijednosti su spremljene.");
  };

  return (
    <>
      <div className="container">
        <div className="selection">
          Distribucijsko područje:
          <select
            className="selectInput"
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
              className="selectInput"
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
              Ulica:
              <input
                className="selectInput"
                type="text"
                onChange={(event) => setStreet(event.target.value)}
                placeholder="Opcionalno - npr. Vukovarska"
                value={street}
              />
            </div>

            <div className="actions">
              <span className="darkColor">{saveStatus}</span>
              <button
                type="submit"
                className="saveButton"
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
