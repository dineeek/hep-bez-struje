import { INotification } from '../../models';

export const NOTIFICATIONS_MOCK: INotification[] = [
  {
    date: '01. 03. 2023.',
    time: 'Očekivano trajanje: 08:00 - 14:00',
    isUserStreet: false,
    note: '',
    place: 'Mjesto: ZAGREB',
    reason: 'Radovi: planirani',
    street: 'Ulica: BADLJEVINSKI PUT, KUSTOŠIJANSKA 71'
  },
  {
    date: '01. 03. 2023.',
    time: 'Očekivano trajanje: 06:00 - 11:00',
    isUserStreet: false,
    note: '',
    place: 'Mjesto: SESVETE',
    reason: 'Radovi: planirani',
    street:
      'Ulica: TRAKOŠĆANSKA 36, KAŠINSKI ODVOJAK, KAŠINSKA 40/A, 40/B, 42-58 par, 29-55 nep'
  },
  {
    date: '01. 03. 2023.',
    time: 'Očekivano trajanje: 06:00 - 12:00',
    isUserStreet: false,
    note: '',
    place: 'Mjesto: ZAGREB',
    reason: 'Radovi: planirani',
    street:
      'MATE UJEVIĆA 2-6 par, 1-7 nep, VLADIMIRA RUŽDJAKA 2/A, METELKOVA, BLAŽA LORKOVIĆA, JEĐUTOVA 2-10 par, 1-9 nep, HOTKO DRAGICE'
  }
];
