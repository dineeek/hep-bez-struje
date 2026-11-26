import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from '../../shared/ErrorBoundary';
import { setUpDocument } from '../../shared/set-up-document';
import {
  buildOutagesUrl,
  formatClockTime,
  getHepToday,
  getMessageLocale,
  getStationLabel,
  localize
} from '../../utils';
import { Loader, OutageList, RefreshIcon, SettingsIcon } from '../components';
import './popup.css';
import { useOutages } from './use-outages';

const openOptions = (): void => {
  chrome.runtime.openOptionsPage();
};

const Popup = () => {
  const { preferences, cache, isRefreshing, hasFailed, refresh } = useOutages();
  const locale = getMessageLocale();
  const isConfigured = !!preferences?.powerStation;

  return (
    <main className="popup">
      <header className="popup-header">
        <img className="popup-icon" src="icons/no_power48.png" alt="" />
        <div className="popup-heading">
          <h1 className="title">{localize('extensionName')}</h1>
          {preferences && isConfigured && (
            <p className="station">
              {getStationLabel(
                preferences.distributionArea,
                preferences.powerStation
              )}
            </p>
          )}
        </div>
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

      {cache && hasFailed && (
        <p className="notice" role="status">
          {localize(
            'messageRefreshFailed',
            formatClockTime(cache.fetchedAt, locale)
          )}
        </p>
      )}

      {preferences && cache && (
        <OutageList
          cache={cache}
          userStreet={preferences.street}
          locale={locale}
        />
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

      {preferences && isConfigured && (
        <footer className="popup-footer">
          {cache && (
            <span data-testid="updated">
              {localize(
                'labelUpdated',
                formatClockTime(cache.fetchedAt, locale)
              )}
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
        </footer>
      )}
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
