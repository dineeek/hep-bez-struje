import { IOutageCache } from '../../models';
import {
  formatDayHeading,
  getSearchDates,
  groupOutagesByDay,
  localize
} from '../../utils';
import { OutageRow } from './outage-row';

export interface OutageListProps {
  cache: IOutageCache;
  userStreet: string;
  locale: string;
}

export const OutageList = ({ cache, userStreet, locale }: OutageListProps) => {
  if (cache.outages.length === 0) {
    return <p className="empty-state">{localize('messageNoNotifications')}</p>;
  }

  const days = groupOutagesByDay(
    cache.outages,
    getSearchDates(cache.futureSearch, cache.today),
    userStreet
  );

  return (
    <>
      {days.map(day => {
        const headingId = `day-${day.date}`;
        const hasOutages = day.outages.length > 0;

        return (
          <section
            key={day.date}
            className={hasOutages ? 'day' : 'day is-empty'}
            aria-labelledby={headingId}
          >
            <div className="day-band">
              <h2 id={headingId} className="day-title">
                {formatDayHeading(day.date, cache.today, locale)}
              </h2>
              {!hasOutages && (
                <p className="day-none">{localize('messageNoOutagesOnDay')}</p>
              )}
            </div>

            {hasOutages && (
              <ul className="outage-list">
                {day.outages.map((dayOutage, index) => (
                  <OutageRow
                    key={`${day.date}-${index}`}
                    outage={dayOutage.outage}
                    userMatch={dayOutage.userMatch}
                  />
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </>
  );
};
