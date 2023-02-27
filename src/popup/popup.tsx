import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { INotification } from "../models/notification.model";
import { ChromeUtil, MetaUtil, ScrapperUtil, URLBuilderUtil } from "../utils";
import "./popup.css";

const Popup = () => {
  const [distributionArea, setDistributionArea] = useState<string>("");
  const [powerPlant, setPowerPlant] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [fetchStatus, setFetchStatus] = useState<string>("");

  const todayDate = new Date().toLocaleString("hr", {
    formatMatcher: "best fit",
    dateStyle: "short",
  });

  const fetchTodaysNotifications = () => {
    const url = URLBuilderUtil.build(distributionArea, powerPlant, todayDate);

    setLoading(true);

    fetch(url)
      .then((res) => res.text())
      .then((document) => ScrapperUtil.scrapData(document))
      .then((notifications) => {
        setLoading(false);
        setNotifications(notifications);
        notifications.length === 0 &&
          setFetchStatus("Nema planiranih prekida napajanja.");
      })
      .catch(() => {
        setLoading(false);
        setFetchStatus("Dogodila se pogreška. Probajte ponovno kasnije.");
      });
  };

  useEffect(() => {
    ChromeUtil.getStatePreferences(setDistributionArea, setPowerPlant);
  }, []);

  useEffect(() => {
    powerPlant && fetchTodaysNotifications();
  }, [powerPlant]);

  const getNotificationList = () => {
    return notifications.map((notification, index) => {
      return (
        <div key={"notification_" + index} className="notifications">
          <span>{notification.place}</span>
          <span>{notification.street}</span>
          {notification.note && <span>{notification.note}</span>}
          <span>{notification.dateTime}</span>
          <span>{notification.reason}</span>
        </div>
      );
    });
  };

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
              Datum: <b>{todayDate}</b>
            </span>

            {loading ? (
              <div className="loader"></div>
            ) : notifications.length > 0 ? (
              getNotificationList()
            ) : (
              <span>{fetchStatus}</span>
            )}
          </>
        ) : (
          <>
            <span>
              Odaberite HEP distribucijsko područje i pogon u opcijama
              ekstenzije za dohvat područja bez struje.
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
