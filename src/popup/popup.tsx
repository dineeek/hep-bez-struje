import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ChromeStorage, INotification, IUserPreferences } from "../models";
import { MetaUtil, ScrapperUtil } from "../utils";
import "./popup.css";

const Popup = () => {
  const [userPreferences, setUserPreferences] = useState<IUserPreferences>({
    distributionArea: "",
    powerStation: "",
    street: "",
    futureSearch: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [fetchStatus, setFetchStatus] = useState<string>("");

  const localize = (translationKey: string): string => {
    return chrome.i18n.getMessage(translationKey);
  };

  useEffect(() => {
    chrome.storage.sync.get(
      {
        [ChromeStorage.DISTRIBUTION_AREA]: "",
        [ChromeStorage.POWER_STATION]: "",
        [ChromeStorage.USER_STREET]: "",
        [ChromeStorage.FUTURE_SEARCH]: false,
      },
      (storage) => {
        setUserPreferences({
          distributionArea: storage[ChromeStorage.DISTRIBUTION_AREA],
          powerStation: storage[ChromeStorage.POWER_STATION],
          street: storage[ChromeStorage.USER_STREET],
          futureSearch: storage[ChromeStorage.FUTURE_SEARCH],
        });
      }
    );
  }, []);

  useEffect(() => {
    userPreferences.powerStation && fetchTodaysNotifications();
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
        setFetchStatus(localize("messageFetchNotificationsError"));
      });
  };

  const setStatusAndBadge = (notifications: INotification[]) => {
    notifications.length === 0 &&
      setFetchStatus(localize("messageNoNotifications"));

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
            {localize("labelDate")} <b>{notification.date}</b>
          </span>

          {notification.place && (
            <span>
              {localize("labelPlace")}
              {notification.place}
            </span>
          )}

          {notification.street && (
            <span>
              {localize("labelStreet")}
              {notification.street}
            </span>
          )}

          {notification.note && (
            <span>
              {localize("labelNote")}
              {notification.note}
            </span>
          )}

          {notification.time && (
            <span>
              {localize("labelTime")}
              <b>{notification.time}</b>
            </span>
          )}

          {notification.reason && (
            <span>
              {localize("labelReason")}
              {notification.reason}
            </span>
          )}
        </div>
      );
    });
  };

  return (
    <>
      <div className="container">
        <div className="title">
          <span> {localize("extensionName")}</span>
          {userPreferences.powerStation ? (
            <img
              className="info"
              src="icons/info.png"
              title={localize("tooltipInfoIcon")}
            />
          ) : null}
        </div>

        {userPreferences.powerStation ? (
          <>
            <span>
              {localize("labelDistributionArea")}
              <b>
                {MetaUtil.getDistributionAreaName(
                  userPreferences.distributionArea
                )}
              </b>
            </span>
            <span>
              {localize("labelPowerStation")}
              <b>
                {MetaUtil.getPowerStationName(userPreferences.powerStation)}
              </b>
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
            <span>{localize("messageNoOptionsSelectedPopup")}</span>
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
