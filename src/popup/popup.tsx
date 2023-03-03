import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ChromeStorage, INotification, IUserPreferences } from "../models";
import { MetaUtil, ScrapperUtil } from "../utils";
import "./popup.css";

const Popup = () => {
  const [userPreferences, setUserPreferences] = useState<IUserPreferences>({
    distributionArea: "",
    powerPlant: "",
    street: "",
    futureSearch: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [fetchStatus, setFetchStatus] = useState<string>("");

  useEffect(() => {
    chrome.storage.sync.get(
      {
        [ChromeStorage.DISTRIBUTION_AREA]: "",
        [ChromeStorage.POWER_PLANT]: "",
        [ChromeStorage.USER_STREET]: "",
        [ChromeStorage.FUTURE_SEARCH]: false,
      },
      (storage) => {
        setUserPreferences({
          distributionArea: storage[ChromeStorage.DISTRIBUTION_AREA],
          powerPlant: storage[ChromeStorage.POWER_PLANT],
          street: storage[ChromeStorage.USER_STREET],
          futureSearch: storage[ChromeStorage.FUTURE_SEARCH],
        });
      }
    );
  }, []);

  useEffect(() => {
    userPreferences.powerPlant && fetchTodaysNotifications();
  }, [userPreferences]);

  const fetchTodaysNotifications = () => {
    setLoading(true);

    ScrapperUtil.getNotifications(userPreferences)
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
      chrome.action.setBadgeBackgroundColor({ color: "red" });
      chrome.action.setBadgeText({ text: userAffectedDaysCount.toString() });
    } else {
      chrome.action.setBadgeText({ text: "" });
    }
  };

  const getNotificationList = () => {
    return notifications.map((notification, index) => {
      return (
        <div
          key={"notification_" + index}
          className={`notification-card ${
            notification.isUserStreet ? "highlight-card" : ""
          }`}
        >
          <span>
            Datum: <b>{notification.date}</b>
          </span>
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
          {userPreferences.powerPlant ? (
            <img
              className="info"
              src="icons/info.png"
              title="Promjena distribucijskog područja i pogona moguća je u opcijama ovog proširenja."
            />
          ) : null}
        </div>

        {userPreferences.powerPlant ? (
          <>
            <span>
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

            {loading ? (
              <div className="loader">
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : notifications.length > 0 ? (
              <>
                <hr className="line-break"></hr>
                {getNotificationList()}
              </>
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
