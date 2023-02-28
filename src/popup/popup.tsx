import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { INotification } from "../models/notification.model";
import { MetaUtil, ScrapperUtil, URLBuilderUtil } from "../utils";
import "./popup.css";

interface IUserPreferences {
  distributionArea: string;
  powerPlant: string;
  street: string;
}

const Popup = () => {
  const [userPreferences, setUserPreferences] = useState<IUserPreferences>({
    distributionArea: "",
    powerPlant: "",
    street: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [fetchStatus, setFetchStatus] = useState<string>("");

  const todayDate = new Date().toLocaleString("hr", {
    dateStyle: "short",
  });

  useEffect(() => {
    chrome.storage.sync.get(
      {
        hepDistributionArea: "",
        hepPowerPlant: "",
        hepUserStreet: "",
      },
      (items) => {
        setUserPreferences({
          distributionArea: items.hepDistributionArea,
          powerPlant: items.hepPowerPlant,
          street: items.hepUserStreet,
        });
      }
    );
  }, []);

  useEffect(() => {
    userPreferences?.powerPlant && fetchTodaysNotifications();
  }, [userPreferences]);

  const fetchTodaysNotifications = () => {
    const url = URLBuilderUtil.build(
      userPreferences.distributionArea,
      userPreferences.powerPlant,
      todayDate
    );

    setLoading(true);

    fetch(url)
      .then((res) => res.text())
      .then((document) =>
        ScrapperUtil.scrapData(document, userPreferences.street)
      )
      .then((notifications) => {
        setLoading(false);
        setStatusAndBadge(notifications);
        setNotifications(notifications);
      })
      .catch(() => {
        setLoading(false);
        setFetchStatus("Dogodila se pogreška. Probajte ponovno kasnije.");
      });
  };

  const setStatusAndBadge = (notifications: INotification[]) => {
    notifications.length === 0 &&
      setFetchStatus("Nema planiranih prekida napajanja.");

    const userAffectedDaysCount = notifications.filter(
      (notification) => notification.isUserStreet
    ).length;

    if (userAffectedDaysCount > 0) {
      chrome.action.setBadgeText({ text: userAffectedDaysCount.toString() });
    } else {
      chrome.action.setBadgeText({ text: "" });
    }
  };

  const getNotificationList = () => {
    return notifications.map((notification, index) => {
      return (
        <div key={"notification_" + index} className="notifications">
          {notification.isUserStreet ? (
            <>
              <div>
                <img className="red-flag" src="icons/red_flag.png" />
                <img className="red-flag" src="icons/red_flag.png" />
                <img className="red-flag" src="icons/red_flag.png" />
              </div>
            </>
          ) : null}
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
        <div className="title">
          <span>HEP - bez struje</span>
          <img
            className="info"
            src="icons/info.png"
            title="Promjena distribucijskog područja i pogona moguća je u opcijama ovog proširenja."
          />
        </div>

        {userPreferences.powerPlant ? (
          <>
            <span className="selected-values">
              Distribucijsko područje:{" "}
              <b>
                {MetaUtil.getDistributionAreaName(
                  userPreferences.distributionArea
                )}
              </b>
            </span>
            <span>
              Pogon:{" "}
              <b>{MetaUtil.getPowerPlantName(userPreferences.powerPlant)}</b>
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
