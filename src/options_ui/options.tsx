import { FormEvent, StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { DISTRIBUTION_AREAS } from '../meta';
import { IUserPreferences } from '../models';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { setUpDocument } from '../shared/set-up-document';
import {
  getPowerStations,
  loadUserPreferences,
  localize,
  MessageKey,
  parseUserStreets,
  saveUserPreferences
} from '../utils';
import './options.css';

const NOTIFICATIONS: chrome.permissions.Permissions = {
  permissions: ['notifications']
};
const SAVED_STATUS_MS = 3000;

const Options = () => {
  const [preferences, setPreferences] = useState<IUserPreferences>({
    distributionArea: '',
    powerStation: '',
    street: '',
    futureSearch: false,
    notify: false
  });
  const [status, setStatus] = useState<MessageKey>();
  const hasStreet = parseUserStreets(preferences.street).length > 0;

  const update = (changes: Partial<IUserPreferences>): void => {
    setPreferences(current => ({ ...current, ...changes }));
    setStatus(undefined);
  };

  const onDistributionAreaChange = (distributionArea: string): void => {
    const powerStations = getPowerStations(distributionArea);

    update({
      distributionArea,
      powerStation: powerStations.length === 1 ? powerStations[0].value : ''
    });
  };

  const onNotifyChange = async (isChecked: boolean): Promise<void> => {
    if (!isChecked) {
      update({ notify: false });
      return;
    }

    const isGranted = await chrome.permissions
      .request(NOTIFICATIONS)
      .catch(() => false);

    update({ notify: isGranted });

    if (!isGranted) {
      setStatus('messageNotifyDenied');
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const savedPreferences: IUserPreferences = {
      ...preferences,
      street: parseUserStreets(preferences.street).join(', '),
      notify: preferences.notify && hasStreet
    };

    try {
      await saveUserPreferences(savedPreferences);
      setPreferences(savedPreferences);
      setStatus('messageOptionsSaved');
    } catch {
      setStatus('messageSaveError');
      return;
    }

    if (!savedPreferences.notify) {
      await chrome.permissions.remove(NOTIFICATIONS).catch(() => false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const storedPreferences = await loadUserPreferences();
        const canNotify =
          storedPreferences.notify &&
          (await chrome.permissions.contains(NOTIFICATIONS));

        setPreferences({ ...storedPreferences, notify: canNotify });
      } catch {
        setStatus('messageLoadError');
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (status !== 'messageOptionsSaved') {
      return;
    }

    const timer = setTimeout(() => setStatus(undefined), SAVED_STATUS_MS);

    return () => clearTimeout(timer);
  }, [status]);

  return (
    <form className="options" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="distributionArea">
          {localize('labelDistributionArea')}
        </label>
        <select
          id="distributionArea"
          className="input"
          value={preferences.distributionArea}
          onChange={event => onDistributionAreaChange(event.target.value)}
        >
          <option value="" disabled>
            {localize('optionChoose')}
          </option>
          {DISTRIBUTION_AREAS.map(area => (
            <option key={area.value} value={area.value}>
              {area.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="powerStation">{localize('labelPowerStation')}</label>
        <select
          id="powerStation"
          className="input"
          value={preferences.powerStation}
          onChange={event => update({ powerStation: event.target.value })}
          disabled={!preferences.distributionArea}
        >
          <option value="" disabled>
            {localize('optionChoose')}
          </option>
          {getPowerStations(preferences.distributionArea).map(station => (
            <option key={station.value} value={station.value}>
              {station.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="userStreet">{localize('labelMyStreet')}</label>
        <input
          id="userStreet"
          className="input"
          type="text"
          autoComplete="off"
          aria-describedby="userStreetHint"
          placeholder={localize('placeholderMyStreet')}
          value={preferences.street}
          onChange={event => update({ street: event.target.value })}
        />
        <p id="userStreetHint" className="hint">
          {localize('hintMyStreet')}
        </p>
      </div>

      <label className="check" htmlFor="futureSearch">
        <input
          id="futureSearch"
          type="checkbox"
          checked={preferences.futureSearch}
          onChange={event => update({ futureSearch: event.target.checked })}
        />
        {localize('labelFutureSearch')}
      </label>

      <label className="check" htmlFor="notify">
        <input
          id="notify"
          type="checkbox"
          checked={preferences.notify && hasStreet}
          onChange={event => onNotifyChange(event.target.checked)}
          disabled={!hasStreet}
        />
        {localize('labelNotify')}
      </label>

      <div className="actions">
        <button
          type="submit"
          className="save-button"
          disabled={!preferences.powerStation}
        >
          {localize('labelSave')}
        </button>
        <p className="status" role="status">
          {status && localize(status)}
        </p>
      </div>
    </form>
  );
};

setUpDocument();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Options />
    </ErrorBoundary>
  </StrictMode>
);
