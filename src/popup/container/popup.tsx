import { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { ChromeStorage, INotification, IUserPreferences } from '../../models';
import { ErrorBoundary } from '../../shared/ErrorBoundary';
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

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const result = await ScrapperUtil.getNotifications(userPreferences);
      setStatusAndBadge(result);
      setNotifications(result);
    } catch {
      setFetchStatus(localize('messageFetchNotificationsError'));
    } finally {
      setLoading(false);
    }
  }, [userPreferences]);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storage = await chrome.storage.sync.get({
          [ChromeStorage.DISTRIBUTION_AREA]: '',
          [ChromeStorage.POWER_STATION]: '',
          [ChromeStorage.USER_STREET]: '',
          [ChromeStorage.FUTURE_SEARCH]: false
        });
        setUserPreferences({
          distributionArea: storage[ChromeStorage.DISTRIBUTION_AREA],
          powerStation: storage[ChromeStorage.POWER_STATION],
          street: storage[ChromeStorage.USER_STREET],
          futureSearch: storage[ChromeStorage.FUTURE_SEARCH]
        });
      } catch {
        setFetchStatus(localize('messageFetchNotificationsError'));
      }
    };
    loadPreferences();
  }, []);

  useEffect(() => {
    if (userPreferences.powerStation) {
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
            alt={localize('tooltipInfoIcon')}
            title={localize('tooltipInfoIcon')}
          />
        ) : null}
      </div>

      {userPreferences.powerStation ? (
        <>
          <div className="meta">
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
              <b>
                {MetaUtil.getPowerStationName(userPreferences.powerStation)}
              </b>
            </span>
          </div>

          {loading ? (
            <Loader />
          ) : notifications.length > 0 ? (
            <>
              <hr className="line-break" />
              <NotificationList notifications={notifications} />
            </>
          ) : (
            <span className="empty-state">{fetchStatus}</span>
          )}
        </>
      ) : (
        <span className="empty-state">
          {localize('messageNoOptionsSelectedPopup')}
        </span>
      )}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Popup />
    </ErrorBoundary>
  </StrictMode>
);
