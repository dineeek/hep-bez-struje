import { IOutage } from '../../models';
import { formatTimeRange, localize, UserMatch } from '../../utils';

export interface OutageRowProps {
  outage: IOutage;
  userMatch: UserMatch | undefined;
}

export const OutageRow = ({ outage, userMatch }: OutageRowProps) => {
  const isFault = outage.kind === 'unplanned';
  const className = userMatch ? 'outage is-user-outage' : 'outage';

  return (
    <li className={className}>
      <div className="outage-time">
        <span>
          <span className="visually-hidden">{localize('labelTime')}</span>
          {formatTimeRange(outage.time)}
        </span>
        <span className="outage-flags">
          {isFault && (
            <span className="flag flag-fault">{localize('tagUnplanned')}</span>
          )}
          {outage.kind === 'other' && outage.reason && (
            <span className="flag">{outage.reason}</span>
          )}
          {userMatch && (
            <span className="flag">
              {localize(
                userMatch === 'place' ? 'tagUserPlace' : 'tagUserStreet'
              )}
            </span>
          )}
        </span>
      </div>

      {outage.place && (
        <p className="outage-place">
          <span className="visually-hidden">{localize('labelPlace')}</span>
          {outage.place}
        </p>
      )}

      {outage.street && (
        <p className="outage-street">
          <span className="visually-hidden">{localize('labelStreet')}</span>
          {outage.street}
        </p>
      )}

      {outage.note && (
        <p className="outage-note">
          <span className="visually-hidden">{localize('labelNote')}</span>
          {outage.note}
        </p>
      )}
    </li>
  );
};
