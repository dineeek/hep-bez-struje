import { IOutageCache } from '../../models';
import {
  formatDayHeading,
  getSearchDates,
  groupOutagesByDay,
  localize
} from '../../utils';
import { OutageCard } from './outage-card';

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
      {days.map(day => (
        <section
          key={day.date}
          className="day"
          aria-labelledby={`day-${day.date}`}
        >
          <h2 id={`day-${day.date}`} className="day-heading">
            {formatDayHeading(day.date, cache.today, locale)}
          </h2>

          {day.outages.length > 0 ? (
            <ul className="outage-list">
              {day.outages.map((dayOutage, index) => (
                <OutageCard
                  key={`${day.date}-${index}`}
                  outage={dayOutage.outage}
                  isUserStreet={dayOutage.isUserStreet}
                />
              ))}
            </ul>
          ) : (
            <p className="day-empty">{localize('messageNoOutagesOnDay')}</p>
          )}
        </section>
      ))}
    </>
  );
};
