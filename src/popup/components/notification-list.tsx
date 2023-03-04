import React from 'react';
import { INotification } from '../../models';

export interface NotificationListProps {
  notifications: INotification[];
}

export const NotificationList = (props: NotificationListProps) => {
  const localize = (translationKey: string): string => {
    return chrome.i18n.getMessage(translationKey);
  };

  return (
    <>
      {props.notifications.map((notification, index) => {
        return (
          <div
            key={'notification_' + index}
            className={`notification-card ${
              notification.isUserStreet ? 'highlight-card' : ''
            }`}
          >
            <span>
              {localize('labelDate')} <b>{notification.date}</b>
            </span>

            {notification.place && (
              <span>
                {localize('labelPlace')}
                {notification.place}
              </span>
            )}

            {notification.street && (
              <span>
                {localize('labelStreet')}
                {notification.street}
              </span>
            )}

            {notification.note && (
              <span>
                {localize('labelNote')}
                {notification.note}
              </span>
            )}

            {notification.time && (
              <span>
                {localize('labelTime')}
                <b>{notification.time}</b>
              </span>
            )}

            {notification.reason && (
              <span>
                {localize('labelReason')}
                {notification.reason}
              </span>
            )}
          </div>
        );
      })}
    </>
  );
};
