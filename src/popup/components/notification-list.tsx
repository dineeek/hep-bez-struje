import { IOutage } from '../../models';
import { isUserStreet } from '../../utils';

export interface NotificationListProps {
  outages: IOutage[];
  userStreet: string;
}

export const NotificationList = (props: NotificationListProps) => {
  const localize = (translationKey: string): string => {
    return chrome.i18n.getMessage(translationKey);
  };
  const formatDate = (date: string): string =>
    new Date(`${date}T00:00:00`).toLocaleDateString(
      chrome.i18n.getUILanguage()
    );

  return (
    <div role="list">
      {props.outages.map((outage, index) => {
        const isHighlighted = isUserStreet(outage.street, props.userStreet);

        return (
          <div
            key={`${outage.date}-${index}`}
            role="listitem"
            className={`notification-card ${
              isHighlighted ? 'highlight-card' : ''
            }`}
            aria-label={
              isHighlighted
                ? `${outage.place} - ${outage.time} (your street)`
                : `${outage.place} - ${outage.time}`
            }
          >
            <span>
              {localize('labelDate')} <b>{formatDate(outage.date)}</b>
            </span>

            {outage.place && (
              <span>
                {localize('labelPlace')}
                {outage.place}
              </span>
            )}

            {outage.street && (
              <span>
                {localize('labelStreet')}
                {outage.street}
              </span>
            )}

            {outage.note && (
              <span>
                {localize('labelNote')}
                {outage.note}
              </span>
            )}

            {outage.time && (
              <span>
                {localize('labelTime')}
                <b>{outage.time}</b>
              </span>
            )}

            {outage.reason && (
              <span>
                {localize('labelReason')}
                {outage.reason}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
