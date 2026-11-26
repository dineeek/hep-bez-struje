export type OutageKind = 'planned' | 'unplanned' | 'other';

export interface IOutage {
  date: string;
  place: string;
  street: string;
  note: string;
  time: string;
  kind: OutageKind;
  reason: string;
}
