import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { IOutage, IUserPreferences } from '../../models';
import { ErrorBoundary } from '../../shared/ErrorBoundary';
import {
  getDistributionAreaName,
  getPowerStationName,
  loadUserPreferences,
  markUserStreetOutagesSeen,
  refreshOutages
} from '../../utils';
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
    futureSearch: false,
    notify: false
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [outages, setOutages] = useState<IOutage[]>([]);
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

        const result = (await refreshOutages(preferences)).outages;

        await markUserStreetOutagesSeen(result, preferences.street);
        setOutages(result);

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
              <b>{getDistributionAreaName(userPreferences.distributionArea)}</b>
            </span>
            <span>
              {localize('labelPowerStation')}
              <b>
                {getPowerStationName(
                  userPreferences.distributionArea,
                  userPreferences.powerStation
                )}
              </b>
            </span>
          </div>

          {loading ? (
            <Loader />
          ) : outages.length > 0 ? (
            <>
              <hr className="line-break" />
              <NotificationList
                outages={outages}
                userStreet={userPreferences.street}
              />
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
