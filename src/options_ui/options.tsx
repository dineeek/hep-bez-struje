import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { DISTRIBUTION_AREAS, IPowerStation } from '../meta';
import { ChromeStorage } from '../models';
import { MetaUtil } from '../utils';
import './options.css';

const Options = () => {
  const [distributionArea, setDistributionArea] = useState<string>('');
  const [powerStation, setPowerStation] = useState<string>('');
  const [distAreaPowerStations, setDistAreaPowerStations] = useState<
    IPowerStation[]
  >([]);
  const [street, setStreet] = useState<string>('');
  const [futureSearch, setFutureSearch] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const localize = (translationKey: string): string => {
    return chrome.i18n.getMessage(translationKey);
  };

  useEffect(() => {
    chrome.storage.sync.get(
      {
        [ChromeStorage.DISTRIBUTION_AREA]: '',
        [ChromeStorage.POWER_STATION]: '',
        [ChromeStorage.USER_STREET]: '',
        [ChromeStorage.FUTURE_SEARCH]: false
      },
      storage => {
        onDistributionAreaChange(storage[ChromeStorage.DISTRIBUTION_AREA]);
        setPowerStation(storage[ChromeStorage.POWER_STATION]);
        setStreet(storage[ChromeStorage.USER_STREET]);
        setFutureSearch(storage[ChromeStorage.FUTURE_SEARCH]);
      }
    );
  }, []);

  const onDistributionAreaChange = (areaValue: string): void => {
    setDistributionArea(areaValue);
    setPowerStation('');
    setStreet('');
    setFutureSearch(false);
    setDistAreaPowerStations(
      MetaUtil.getDistributionAreaPowerStations(areaValue)
    );
  };

  const getAreaOptions = () => {
    return DISTRIBUTION_AREAS.map(area => (
      <option key={area.value} value={area.value}>
        {area.name}
      </option>
    ));
  };

  const getPowerStationOptions = () => {
    return distAreaPowerStations.map(station => {
      return (
        <option key={station.value} value={station.value}>
          {station.name}
        </option>
      );
    });
  };

  const showStatus = (messageKey: string) => {
    setSaveStatus(localize(messageKey));

    const id = setTimeout(() => {
      setSaveStatus('');
    }, 2000);
    return () => clearTimeout(id);
  };

  const saveOptions = () => {
    if (!distributionArea || !powerStation) {
      showStatus('messageNoOptionsSelected');
      return;
    }

    chrome.storage.sync.set({
      [ChromeStorage.DISTRIBUTION_AREA]: distributionArea,
      [ChromeStorage.POWER_STATION]: powerStation,
      [ChromeStorage.USER_STREET]: street,
      [ChromeStorage.FUTURE_SEARCH]: futureSearch
    });

    showStatus('messageOptionsSaved');
  };

  return (
    <>
      <div className="container">
        <div className="selection">
          {localize('labelDistributionArea')}
          <select
            className="select-input"
            value={distributionArea}
            onChange={event => onDistributionAreaChange(event.target.value)}
          >
            <option defaultValue="none" hidden></option>
            {getAreaOptions()}
          </select>
        </div>

        {distributionArea && (
          <div className="selection">
            {localize('labelPowerStation')}
            <select
              className="select-input"
              value={powerStation}
              onChange={event => setPowerStation(event.target.value)}
            >
              <option defaultValue="none" hidden></option>
              {getPowerStationOptions()}
            </select>
          </div>
        )}

        {distributionArea && powerStation && (
          <>
            <div className="selection">
              {localize('labelMyStreet')}
              <input
                className="select-input"
                type="text"
                onChange={event => setStreet(event.target.value)}
                placeholder={localize('placeholderMyStreet')}
                value={street}
              />
            </div>

            <div className="checkbox">
              {localize('labelFutureSearch')}
              <input
                className="check-input"
                type="checkbox"
                checked={futureSearch}
                onChange={() => setFutureSearch(!futureSearch)}
              />
            </div>

            <div className="actions">
              <span className="darkColor">{saveStatus}</span>
              <button
                type="submit"
                className="save-button"
                onClick={saveOptions}
              >
                {localize('labelSave')}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById('root')
);
