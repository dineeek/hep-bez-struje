import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { DISTRIBUTION_AREAS, IDistributionArea, IPowerStation } from '../meta';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import {
  getPowerStations,
  loadUserPreferences,
  saveUserPreferences
} from '../utils';
import './options.css';

const Options = () => {
  const [distributionArea, setDistributionArea] = useState<string>('');
  const [powerStation, setPowerStation] = useState<string>('');
  const [areaPowerStations, setAreaPowerStations] = useState<IPowerStation[]>(
    []
  );
  const [street, setStreet] = useState<string>('');
  const [futureSearch, setFutureSearch] = useState<boolean>(false);
  const [notify, setNotify] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const localize = (translationKey: string): string => {
    return chrome.i18n.getMessage(translationKey);
  };

  const onDistributionAreaChange = (areaValue: string): void => {
    setDistributionArea(areaValue);
    setPowerStation('');
    setStreet('');
    setFutureSearch(false);
    setAreaPowerStations(getPowerStations(areaValue));
  };

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const preferences = await loadUserPreferences();

        setDistributionArea(preferences.distributionArea);
        setAreaPowerStations(getPowerStations(preferences.distributionArea));
        setPowerStation(preferences.powerStation);
        setStreet(preferences.street);
        setFutureSearch(preferences.futureSearch);
        setNotify(preferences.notify);
      } catch {
        setSaveStatus(localize('messageFetchNotificationsError'));
      }
    };
    loadPreferences();
  }, []);

  const getOptions = (metaValues: IDistributionArea[] | IPowerStation[]) => {
    return metaValues.map(meta => (
      <option key={meta.value} value={meta.value}>
        {meta.name}
      </option>
    ));
  };

  const showStatus = (messageKey: string) => {
    setSaveStatus(localize(messageKey));

    const id = setTimeout(() => {
      setSaveStatus('');
    }, 2000);
    return () => clearTimeout(id);
  };

  const saveOptions = async () => {
    if (!distributionArea || !powerStation) {
      showStatus('messageNoOptionsSelected');
      return;
    }

    try {
      await saveUserPreferences({
        distributionArea,
        powerStation,
        street,
        futureSearch,
        notify
      });
      showStatus('messageOptionsSaved');
    } catch {
      showStatus('messageNoOptionsSelected');
    }
  };

  return (
    <div className="container">
      <div className="selection">
        <label htmlFor="distributionArea">
          {localize('labelDistributionArea')}
        </label>
        <select
          id="distributionArea"
          className="select-input"
          value={distributionArea}
          onChange={event => onDistributionAreaChange(event.target.value)}
        >
          <option key="emptyArea" defaultValue="none" hidden></option>
          {getOptions(DISTRIBUTION_AREAS)}
        </select>
      </div>

      {distributionArea && (
        <div className="selection">
          <label htmlFor="powerStation">{localize('labelPowerStation')}</label>
          <select
            id="powerStation"
            className="select-input"
            value={powerStation}
            onChange={event => setPowerStation(event.target.value)}
          >
            <option key="emptyStation" defaultValue="none" hidden></option>
            {getOptions(areaPowerStations)}
          </select>
        </div>
      )}

      {powerStation && (
        <>
          <div className="selection">
            <label htmlFor="userStreet">{localize('labelMyStreet')}</label>
            <input
              id="userStreet"
              className="select-input"
              type="text"
              onChange={event => setStreet(event.target.value)}
              placeholder={localize('placeholderMyStreet')}
              value={street}
            />
          </div>

          <div className="checkbox">
            <label htmlFor="futureSearch">
              {localize('labelFutureSearch')}
            </label>
            <input
              id="futureSearch"
              className="check-input"
              type="checkbox"
              checked={futureSearch}
              onChange={() => setFutureSearch(!futureSearch)}
            />
          </div>

          <div className="actions">
            <button type="submit" className="save-button" onClick={saveOptions}>
              {localize('labelSave')}
            </button>
            {saveStatus && <span className="status-color">{saveStatus}</span>}
          </div>
        </>
      )}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Options />
    </ErrorBoundary>
  </StrictMode>
);
