export interface IDistributionArea {
  id: number;
  value: string; // search param - dp=value
  name: string;
}

export const DISTRIBUTION_AREAS: IDistributionArea[] = [
  {
    id: 1,
    value: 'bjelovar',
    name: 'Elektra Bjelovar'
  },
  {
    id: 2,
    value: 'cakovec',
    name: 'Elektra Čakovec'
  },
  {
    id: 3,
    value: 'karlovac',
    name: 'Elektra Karlovac'
  },
  {
    id: 4,
    value: 'koprivnica',
    name: 'Elektra Koprivnica'
  },
  {
    id: 5,
    value: 'kriz',
    name: 'Elektra Križ'
  },
  {
    id: 6,
    value: 'pozega',
    name: 'Elektra Požega'
  },
  {
    id: 7,
    value: 'sisak',
    name: 'Elektra Sisak'
  },
  {
    id: 8,
    value: 'sbrod',
    name: 'Elektra Slavonski Brod'
  },
  {
    id: 9,
    value: 'sibenik',
    name: 'Elektra Šibenik'
  },
  {
    id: 10,
    value: 'varazdin',
    name: 'Elektra Varaždin'
  },
  {
    id: 11,
    value: 'vinkovci',
    name: 'Elektra Vinkovci'
  },
  {
    id: 12,
    value: 'virovitica',
    name: 'Elektra Virovitica'
  },
  {
    id: 13,
    value: 'zabok',
    name: 'Elektra Zabok'
  },
  {
    id: 14,
    value: 'zadar',
    name: 'Elektra Zadar'
  },
  {
    id: 15,
    value: 'zagreb',
    name: 'Elektra Zagreb'
  },
  {
    id: 16,
    value: 'split',
    name: 'Elektrodalmacija Split'
  },
  {
    id: 17,
    value: 'pula',
    name: 'Elektroistra Pula'
  },
  {
    id: 18,
    value: 'dubrovnik',
    name: 'Elektrojug Dubrovnik'
  },
  {
    id: 19,
    value: 'gospic',
    name: 'Elektrolika Gospić'
  },
  {
    id: 20,
    value: 'rijeka',
    name: 'Elektroprimorje Rijeka'
  },
  {
    id: 21,
    value: 'osijek',
    name: 'Elektroslavonija Osijek'
  }
];
