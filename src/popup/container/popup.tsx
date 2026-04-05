import { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { ChromeStorage, INotification, IUserPreferences } from '../../models';
import { MetaUtil, ScrapperUtil } from '../../utils';
import { Loader, NotificationList } from '../components';
import './popup.css';

const localize = (translationKey: string): string => {
  return chrome.i18n.getMessage(translationKey);
};

const Popup = () => {
  const [userPreferences, setUserPreferences] = useState<IUserPreferences>({
    distributionArea: '',
    powerStation: '',
    street: '',
    futureSearch: false
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [fetchStatus, setFetchStatus] = useState<string>('');

  const setStatusAndBadge = (notifs: INotification[]) => {
    if (notifs.length === 0) {
      chrome.action.setBadgeText({ text: '' });
      setFetchStatus(localize('messageNoNotifications'));
      return;
    }

    const userAffectedDaysCount = notifs.filter(
      notification => notification.isUserStreet
    ).length;

    if (userAffectedDaysCount > 0) {
      chrome.action.setBadgeBackgroundColor({ color: 'red' });
      chrome.action.setBadgeText({ text: userAffectedDaysCount.toString() });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  };

  const fetchNotifications = useCallback(() => {
    setLoading(true);

    ScrapperUtil.getNotifications(userPreferences)
      .then(result => {
        setLoading(false);
        setStatusAndBadge(result);
        setNotifications(result);
      })
      .catch(() => {
        setLoading(false);
        setFetchStatus(localize('messageFetchNotificationsError'));
      });
  }, [userPreferences]);

  useEffect(() => {
    chrome.storage.sync.get(
      {
        [ChromeStorage.DISTRIBUTION_AREA]: '',
        [ChromeStorage.POWER_STATION]: '',
        [ChromeStorage.USER_STREET]: '',
        [ChromeStorage.FUTURE_SEARCH]: false
      },
      storage => {
        setUserPreferences({
          distributionArea: storage[ChromeStorage.DISTRIBUTION_AREA],
          powerStation: storage[ChromeStorage.POWER_STATION],
          street: storage[ChromeStorage.USER_STREET],
          futureSearch: storage[ChromeStorage.FUTURE_SEARCH]
        });
      }
    );
  }, []);

  useEffect(() => {
    if (userPreferences.powerStation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching on preference change is intentional
      fetchNotifications();
    }
  }, [userPreferences, fetchNotifications]);

  return (
    <div className="container">
      <div className="title">
        <span> {localize('extensionName')}</span>
        {userPreferences.powerStation ? (
          <img
            className="info"
            src="icons/info.png"
            title={localize('tooltipInfoIcon')}
          />
        ) : null}
      </div>

      {userPreferences.powerStation ? (
        <>
          <span>
            {localize('labelDistributionArea')}
            <b>
              {MetaUtil.getDistributionAreaName(
                userPreferences.distributionArea
              )}
            </b>
          </span>
          <span>
            {localize('labelPowerStation')}
            <b>{MetaUtil.getPowerStationName(userPreferences.powerStation)}</b>
          </span>

          {loading ? (
            <Loader />
          ) : notifications.length > 0 ? (
            <>
              <hr className="line-break"></hr>
              <NotificationList notifications={notifications} />
            </>
          ) : (
            <span>{fetchStatus}</span>
          )}
        </>
      ) : (
        <span>{localize('messageNoOptionsSelectedPopup')}</span>
      )}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Popup />
  </StrictMode>
);
