import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ChromeUtil } from "../utils/chrome-storage";
import { MetaUtil } from "../utils/meta";
import { popupStyle } from "./popup-style";

const Popup = () => {
  const [distributionArea, setDistributionArea] = useState<string>("");
  const [powerPlant, setPowerPlant] = useState<string>("");

  useEffect(() => {
    ChromeUtil.getStatePreferences(setDistributionArea, setPowerPlant);
  }, [distributionArea, powerPlant]);

  return (
    <>
      <div style={popupStyle.container}>
        <span style={popupStyle.title}>HEP - bez struje</span>
        {distributionArea && powerPlant ? (
          <>
            <span>
              Distribucijsko područje:
              {MetaUtil.getDistributionAreaName(distributionArea)}
            </span>
            <span>Pogon: {MetaUtil.getPowerPlantName(powerPlant)}</span>
            <span>
              Datum:{" "}
              {new Date().toLocaleString("hr", {
                formatMatcher: "best fit",
              })}
            </span>
          </>
        ) : (
          <>
            <span>
              Odaberite HEP distribucijsko područje i pogon u opcijama
              ekstenzije za pregled područja bez struje.
            </span>
          </>
        )}
      </div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
