import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import { HepPageError, parseOutages } from '../utils/parse-outages';
import {
  FIXTURE_DATE,
  FIXTURE_NAMES,
  readFixture
} from './fixtures/read-fixture';

const toOutageList = (blocks: string): string =>
  `<html><body><div Class="radwrap">${blocks}</div></body></html>`;

const readOutagesWithDom = (pageHtml: string) => {
  const { document } = new JSDOM(pageHtml).window;
  const readText = (element: Element | null | undefined): string =>
    (element?.textContent ?? '').replace(/\s+/g, ' ').trim();

  return [...document.querySelectorAll('.radwrap .mjesto')].map(placeBlock => {
    const timeBlock = placeBlock.nextElementSibling;
    const fields = [...placeBlock.querySelectorAll('.ulica')].map(readText);
    const street = fields.find(field => field.startsWith('Ulica:')) ?? '';
    const note = fields.find(field => field.startsWith('Napomena:')) ?? '';

    return {
      place: readText(placeBlock.querySelector('.grad')).replace(
        /^Mjesto:\s*/,
        ''
      ),
      street: street.replace(/^Ulica:\s*/, ''),
      note: note.replace(/^Napomena:\s*/, ''),
      time: readText(timeBlock?.querySelector('.kada')),
      reason: readText(timeBlock?.querySelector('.tip')).replace(
        /^Radovi:\s*/,
        ''
      )
    };
  });
};

describe('parseOutages', () => {
  it('should read planned outages from a full HEP page', () => {
    expect(parseOutages(readFixture('zagreb-ZG'), FIXTURE_DATE)).toEqual([
      {
        date: '2026-11-26',
        place: 'ZAGREB',
        street: 'KOLEDOVČINA 2/A-8 par, 1/D, SLAVONSKA AVENIJA 26/1',
        note: '',
        time: '09:00 - 13:00',
        kind: 'planned',
        reason: 'planirani'
      },
      {
        date: '2026-11-26',
        place: 'ZAGREB',
        street: 'OREŠIĆI 9-do kraja obje',
        note: '',
        time: '08:00 - 13:00',
        kind: 'planned',
        reason: 'planirani'
      },
      {
        date: '2026-11-26',
        place: 'SESVETE',
        street:
          'BJELOVARSKA 2-32 par, 3, BRIBIRSKA 2-4 par, 1-23 nep, KARLOVAČKA 2-30 par, 1-25 nep, MODRUŠKA 1-13 nep, NINSKA 2-6 par, 1-9 nep, 9/A, OZALJSKA 1-24 obje, TRG DRAGUTINA DOMJANIĆA 4, 5/1',
        note: '',
        time: '09:00 - 10:00',
        kind: 'planned',
        reason: 'planirani'
      },
      {
        date: '2026-11-26',
        place: 'ZAGREB',
        street: 'ULICA MATE MERŠIĆA 1-8 obje',
        note: '',
        time: '09:00 - 14:00',
        kind: 'planned',
        reason: 'planirani'
      }
    ]);
  });

  it('should read an unplanned outage with a note and no street', () => {
    const [fault, planned] = parseOutages(
      readFixture('pula-121'),
      FIXTURE_DATE
    );

    expect(fault).toEqual({
      date: '2026-11-26',
      place: 'Marčana',
      street: '',
      note: 'Dio naselja Marčana oko broja 565 i 574.',
      time: '08:30 - 10:00',
      kind: 'unplanned',
      reason: 'neplanirani (kvar)'
    });
    expect(planned).toEqual({
      date: '2026-11-26',
      place: 'Fažana',
      street: 'Galižanska cesta oko broja 74 A.',
      note: 'u slučaju lošeg vremena radovi se mogu odgoditi.',
      time: '08:30 - 11:00',
      kind: 'planned',
      reason: 'planirani'
    });
  });

  it('should keep a space where a street has a line break', () => {
    const [outage] = parseOutages(readFixture('rijeka-RI'), FIXTURE_DATE);

    expect(outage.street).toBe(
      '- Petra Jurčića br. 24, 24A - Bože Vidasa br. 7 (neboder), 14 - Ivana Lenca br. 2 - 12 (parni brojevi)'
    );
  });

  it('should keep two outages with the same place and time', () => {
    const outages = parseOutages(readFixture('karlovac-KA'), FIXTURE_DATE);
    const sameSlot = outages.filter(
      outage => outage.place === 'KARLOVAC' && outage.time === '08:00 - 15:00'
    );

    expect(sameSlot.map(outage => outage.street)).toEqual([
      'LJUDEVITA JONKEA 2/A, MARTINA GAMBONA 2-6 par, 6/I, 1-5 nep',
      'Gambonova 1 - 5; Bencetićeva 1; Lukšićeva 2'
    ]);
  });

  it('should return no outages when HEP lists none', () => {
    expect(parseOutages(readFixture('bjelovar-BJ'), FIXTURE_DATE)).toEqual([]);
  });

  it.each(FIXTURE_NAMES)('should read %s the way a DOM does', name => {
    const pageHtml = readFixture(name);
    const outages = parseOutages(pageHtml, FIXTURE_DATE).map(
      ({ place, street, note, time, reason }) => ({
        place,
        street,
        note,
        time,
        reason
      })
    );

    expect(outages).toEqual(readOutagesWithDom(pageHtml));
  });

  it('should decode HTML entities', () => {
    const [outage] = parseOutages(
      toOutageList(`
        <div class='mjesto tipR'>
          <div class="grad"><strong>Mjesto:</strong> BRA&Ccaron; &amp; HVAR</div>
          <div class="ulica"><strong>Ulica:</strong> OBALA&nbsp;1 &#8211; 5, &#x161;etali&scaron;te</div>
        </div>
        <div class="vrijeme tipR"><strong>Očekivano trajanje:</strong>
          <div class="kada">08:00 - 09:00</div>
          <div class="tip">Radovi: planirani</div>
        </div>`),
      FIXTURE_DATE
    );

    expect(outage.place).toBe('BRAČ & HVAR');
    expect(outage.street).toBe('OBALA 1 – 5, šetalište');
  });

  it('should fall back to the block class when the reason is missing', () => {
    const [outage] = parseOutages(
      toOutageList(`
        <div class="mjesto tipP"><div class="grad"><strong>Mjesto:</strong> SPLIT</div></div>
        <div class="vrijeme tipP"><div class="kada">10:00 - 11:00</div></div>`),
      FIXTURE_DATE
    );

    expect(outage.kind).toBe('unplanned');
    expect(outage.reason).toBe('');
  });

  it('should throw when the page has no outage list', () => {
    expect(() =>
      parseOutages(
        '<html><body><h1>Stranica u izradi</h1></body></html>',
        FIXTURE_DATE
      )
    ).toThrow(HepPageError);
  });

  it('should throw when the list holds blocks it does not know', () => {
    expect(() =>
      parseOutages(
        toOutageList('<div class="prekid"><span>ZAGREB 08:00</span></div>'),
        FIXTURE_DATE
      )
    ).toThrow(HepPageError);
  });

  it('should throw when outage blocks have no readable fields', () => {
    expect(() =>
      parseOutages(
        toOutageList(
          '<div class="mjesto tipR"><div class="naselje">ZAGREB</div></div>'
        ),
        FIXTURE_DATE
      )
    ).toThrow(HepPageError);
  });
});
