import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { INotification, IUserPreferences } from '../../models';
import { ErrorBoundary } from '../../shared/ErrorBoundary';
import { loadUserPreferences, MetaUtil, ScrapperUtil } from '../../utils';
import { Loader, NotificationList } from '../components';
import './popup.css';

const localize = (translationKey: string): string => {
  return chrome.i18n.getMessage(translationKey);
};

const setBadge = (notifications: INotification[]): void => {
  const userStreetCount = notifications.filter(
    notification => notification.isUserStreet
  ).length;

  if (userStreetCount > 0) {
    chrome.action.setBadgeBackgroundColor({ color: 'red' });
    chrome.action.setBadgeText({ text: userStreetCount.toString() });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
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

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const preferences = await loadUserPreferences();

        setUserPreferences(preferences);

        if (!preferences.powerStation) {
          return;
        }

        setLoading(true);

        const result = await ScrapperUtil.getNotifications(preferences);

        setBadge(result);
        setNotifications(result);

        if (result.length === 0) {
          setFetchStatus(localize('messageNoNotifications'));
        }
      } catch {
        setFetchStatus(localize('messageFetchNotificationsError'));
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

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
