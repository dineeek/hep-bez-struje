import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { INotification } from "../models/notification.model";
import { ChromeUtil, MetaUtil, ScrapperUtil, URLBuilderUtil } from "../utils";
import { popupStyle } from "./popup-style";

const Popup = () => {
  const [distributionArea, setDistributionArea] = useState<string>("");
  const [powerPlant, setPowerPlant] = useState<string>("");
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    ChromeUtil.getStatePreferences(setDistributionArea, setPowerPlant);
  }, [distributionArea, powerPlant]);

  useEffect(() => {
    const today = new Date().toLocaleString("hr", {
      formatMatcher: "best fit",
      dateStyle: "short",
    });
    const url = URLBuilderUtil.buildUrl(distributionArea, powerPlant, today);

    fetch(url)
      .then((res) => res.text())
      .then((document) => ScrapperUtil.scrapData(document, today))
      .then((notifications) => setNotifications(notifications));
  }, [powerPlant]);

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
                  dateStyle: "short",
                })}
              </b>
            </span>

            {notifications.map((notification, index) => {
              return (
                <div
                  key={"notification_" + index}
                  style={{
                    display: "flex",
                    flexFlow: "column nowrap",
                    rowGap: "10px",
                  }}
                >
                  <span>{notification.place}</span>
                  <span>{notification.street}</span>
                  <span>{notification.note}</span>
                  <span>{notification.dateTime}</span>
                  <span>{notification.reason}</span>
                  <br />
                </div>
              );
            })}
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
