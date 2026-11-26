import { IOutage } from '../../models';
import { localize } from '../../utils';

export interface OutageCardProps {
  outage: IOutage;
  isUserStreet: boolean;
}

export const OutageCard = ({ outage, isUserStreet }: OutageCardProps) => {
  return (
    <li className={`outage-card ${isUserStreet ? 'is-user-street' : ''}`}>
      <div className="outage-head">
        <span className="outage-time">
          <span className="visually-hidden">{localize('labelTime')}</span>
          {outage.time}
        </span>
        {isUserStreet && (
          <span className="tag tag-user-street">
            {localize('tagUserStreet')}
          </span>
        )}
        {outage.kind === 'unplanned' && (
          <span className="tag tag-unplanned">{localize('tagUnplanned')}</span>
        )}
        {outage.kind === 'other' && outage.reason && (
          <span className="tag">{outage.reason}</span>
        )}
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
          {localize('labelNote')}
          {outage.note}
        </p>
      )}
    </li>
  );
};
