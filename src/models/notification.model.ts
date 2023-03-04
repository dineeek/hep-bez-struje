export interface INotification {
  place: string | undefined;
  street: string | undefined;
  isUserStreet: boolean;
  note: string | undefined;
  date: string;
  time: string | undefined;
  reason: string | undefined;
}
