import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ChromeUtil, MetaUtil } from "../utils";
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
            <span style={popupStyle.selectedValues}>
              Distribucijsko područje:{" "}
              <b>{MetaUtil.getDistributionAreaName(distributionArea)}</b>
            </span>
            <span>
              Pogon: <b>{MetaUtil.getPowerPlantName(powerPlant)}</b>
            </span>
            <span>
              Datum:{" "}
              <b>
                {new Date().toLocaleString("hr", {
                  formatMatcher: "best fit",
                })}
              </b>
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
