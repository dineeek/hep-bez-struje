import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { INotification } from "../models/notification.model";
import { ChromeUtil, MetaUtil, ScrapperUtil, URLBuilderUtil } from "../utils";
import "./popup.css";

const Popup = () => {
  const [distributionArea, setDistributionArea] = useState<string>("");
  const [powerPlant, setPowerPlant] = useState<string>("");
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTodaysNotifications = () => {
    const today = new Date().toLocaleString("hr", {
      formatMatcher: "best fit",
      dateStyle: "short",
    });
    const url = URLBuilderUtil.build(distributionArea, powerPlant, today);

    setLoading(true);

    fetch(url)
      .then((res) => res.text())
      .then((document) => ScrapperUtil.scrapData(document))
      .then((notifications) => {
        setLoading(false);
        setNotifications(notifications);
      });
  };

  useEffect(() => {
    ChromeUtil.getStatePreferences(setDistributionArea, setPowerPlant);
  }, []);

  useEffect(() => {
    powerPlant && fetchTodaysNotifications();
  }, [powerPlant]);

  return (
    <>
      <div className="container">
        <span className="title">HEP - bez struje</span>
        {distributionArea && powerPlant ? (
          <>
            <span className="selectedValues">
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

            {loading ? (
              <div className="loader"></div>
            ) : notifications.length > 0 ? (
              notifications.map((notification, index) => {
                return (
                  <div key={"notification_" + index} className="notifications">
                    <span>{notification.place}</span>
                    <span>{notification.street}</span>
                    {notification.note && <span>{notification.note}</span>}
                    <span>{notification.dateTime}</span>
                    <span>{notification.reason}</span>
                  </div>
                );
              })
            ) : (
              "Nema planiranih prekida napajanja."
            )}
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
