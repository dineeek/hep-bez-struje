import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IOutageCache, IUserPreferences } from '../../models';
import { ErrorBoundary } from '../../shared/ErrorBoundary';
import { setUpDocument } from '../../shared/set-up-document';
import {
  buildOutagesUrl,
  formatClockTime,
  getDistributionAreaName,
  getHepToday,
  getMessageLocale,
  getPowerStationName,
  localize
} from '../../utils';
import { Loader, OutageList, RefreshIcon, SettingsIcon } from '../components';
import './popup.css';
import { useOutages } from './use-outages';

const openOptions = (): void => {
  chrome.runtime.openOptionsPage();
};

interface StationProps {
  preferences: IUserPreferences;
  cache: IOutageCache | undefined;
  locale: string;
}

const Station = ({ preferences, cache, locale }: StationProps) => {
  const areaName = getDistributionAreaName(preferences.distributionArea);
  const stationName = getPowerStationName(
    preferences.distributionArea,
    preferences.powerStation
  );

  return (
    <div className="station">
      <span className="station-name">
        {[...new Set([areaName, stationName])].filter(Boolean).join(' · ')}
      </span>
      <span className="station-source">
        {cache && (
          <span data-testid="updated">
            {localize('labelUpdated', formatClockTime(cache.fetchedAt, locale))}
          </span>
        )}
        <a
          href={buildOutagesUrl(
            preferences.distributionArea,
            preferences.powerStation,
            cache?.today ?? getHepToday()
          )}
          target="_blank"
          rel="noreferrer"
        >
          {localize('linkHepPage')}
        </a>
      </span>
    </div>
  );
};

const Popup = () => {
  const { preferences, cache, isRefreshing, hasFailed, refresh } = useOutages();
  const locale = getMessageLocale();
  const isConfigured = !!preferences?.powerStation;

  return (
    <main className="popup">
      <header className="popup-header">
        <h1 className="title">{localize('extensionName')}</h1>
        <div className="header-actions">
          {isConfigured && (
            <button
              type="button"
              className={`icon-button ${isRefreshing ? 'is-spinning' : ''}`}
              onClick={refresh}
              disabled={isRefreshing}
              aria-label={localize('buttonRefresh')}
              title={localize('buttonRefresh')}
            >
              <RefreshIcon />
            </button>
          )}
          <button
            type="button"
            className="icon-button"
            onClick={openOptions}
            aria-label={localize('buttonOpenOptions')}
            title={localize('buttonOpenOptions')}
          >
            <SettingsIcon />
          </button>
        </div>
      </header>

      {preferences && !isConfigured && (
        <div className="empty-state">
          <p>{localize('messageNoOptionsSelectedPopup')}</p>
          <button type="button" className="text-button" onClick={openOptions}>
            {localize('buttonOpenOptions')}
          </button>
        </div>
      )}

      {preferences && isConfigured && (
        <>
          <Station preferences={preferences} cache={cache} locale={locale} />

          {cache && hasFailed && (
            <p className="notice" role="status">
              {localize(
                'messageRefreshFailed',
                formatClockTime(cache.fetchedAt, locale)
              )}
            </p>
          )}

          {cache && (
            <OutageList
              cache={cache}
              userStreet={preferences.street}
              locale={locale}
            />
          )}
        </>
      )}

      {!cache && hasFailed && (
        <div className="empty-state" role="alert">
          <p>{localize('messageFetchNotificationsError')}</p>
          {isConfigured && (
            <button type="button" className="text-button" onClick={refresh}>
              {localize('buttonRefresh')}
            </button>
          )}
        </div>
      )}

      {isConfigured && !cache && !hasFailed && <Loader />}
    </main>
  );
};

setUpDocument();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Popup />
    </ErrorBoundary>
  </StrictMode>
);
