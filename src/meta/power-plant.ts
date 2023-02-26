interface IPowerPlant {
  distributionAreaId: number;
  value: string; // search param - el=value
  name: string;
}

export const POWER_PLANTS: IPowerPlant[] = [
  {
    distributionAreaId: 1,
    value: "BJ",
    name: "Elektra Bjelovar",
  },
  {
    distributionAreaId: 1,
    value: "126",
    name: "Pogon Križevci",
  },
  {
    distributionAreaId: 2,
    value: "CK",
    name: "Elektra Čakovec",
  },
  {
    distributionAreaId: 3,
    value: "172",
    name: "Duga Resa",
  },
  {
    distributionAreaId: 3,
    value: "171",
    name: "Jastrebarsko",
  },
  {
    distributionAreaId: 3,
    value: "KA",
    name: "Karlovac",
  },
  {
    distributionAreaId: 3,
    value: "169",
    name: "Ogulin",
  },
  {
    distributionAreaId: 3,
    value: "168",
    name: "Ozalj",
  },
  {
    distributionAreaId: 4,
    value: "124",
    name: "Đurđevac",
  },
  {
    distributionAreaId: 4,
    value: "123",
    name: "Koprivnica",
  },
  {
    distributionAreaId: 4,
    value: "125",
    name: "Ludbreg",
  },
  {
    distributionAreaId: 5,
    value: "KZ",
    name: "Elektra Križ",
  },
  {
    distributionAreaId: 5,
    value: "116",
    name: "Pogon Daruvar",
  },
  {
    distributionAreaId: 5,
    value: "112",
    name: "Pogon Kutina",
  },
  {
    distributionAreaId: 5,
    value: "104",
    name: "Pogon Lipik",
  },
  {
    distributionAreaId: 6,
    value: "PO",
    name: "Elektra Požega",
  },
  {
    distributionAreaId: 7,
    value: "150",
    name: "Pogon Dvor na Uni",
  },
  {
    distributionAreaId: 7,
    value: "146",
    name: "Pogon Glina",
  },
  {
    distributionAreaId: 7,
    value: "149",
    name: "Pogon Hrvatska Kostajnica",
  },
  {
    distributionAreaId: 7,
    value: "145",
    name: "Pogon Petrinja",
  },
  {
    distributionAreaId: 7,
    value: "148",
    name: "Pogon Sunja",
  },
  {
    distributionAreaId: 7,
    value: "147",
    name: "Pogon Topusko",
  },
  {
    distributionAreaId: 7,
    value: "SI",
    name: "Sjedište Elektre Sisak",
  },
  {
    distributionAreaId: 8,
    value: "SB",
    name: "Elektra Slavonski Brod",
  },
  {
    distributionAreaId: 8,
    value: "137",
    name: "Nova Gradiška",
  },
  {
    distributionAreaId: 9,
    value: "SIB",
    name: "Elektra Šibenik",
  },
  {
    distributionAreaId: 9,
    value: "107",
    name: "Pogon Drniš",
  },
  {
    distributionAreaId: 9,
    value: "106",
    name: "Pogon Knin",
  },
  {
    distributionAreaId: 10,
    value: "108",
    name: "Pogon Ivanec",
  },
  {
    distributionAreaId: 10,
    value: "109",
    name: "Pogon Novi Marof",
  },
  {
    distributionAreaId: 10,
    value: "134",
    name: "Pogonski ured Vinica",
  },
  {
    distributionAreaId: 10,
    value: "VZ",
    name: "Sjedište Varaždin",
  },
  {
    distributionAreaId: 11,
    value: "VI",
    name: "Elektra Vinkovci",
  },
  {
    distributionAreaId: 12,
    value: "VIR",
    name: "Elektra Virovitica",
  },
  {
    distributionAreaId: 12,
    value: "151",
    name: "Slatina",
  },
  {
    distributionAreaId: 13,
    value: "193",
    name: "Pregrada",
  },
  {
    distributionAreaId: 13,
    value: "ZB",
    name: "Zabok",
  },
  {
    distributionAreaId: 13,
    value: "194",
    name: "Zlatar Bistrica",
  },
  {
    distributionAreaId: 14,
    value: "ZD",
    name: "Elektra Zadar",
  },
  {
    distributionAreaId: 15,
    value: "ZG",
    name: "Elektra Zagreb",
  },
  {
    distributionAreaId: 15,
    value: "115",
    name: "Pogon Samobor",
  },
  {
    distributionAreaId: 15,
    value: "114",
    name: "Pogon Velika Gorica",
  },
  {
    distributionAreaId: 15,
    value: "177",
    name: "Pogon Zaprešić",
  },
  {
    distributionAreaId: 15,
    value: "113",
    name: "Pogon Zelina",
  },
  {
    distributionAreaId: 15,
    value: "187",
    name: "Pogon Dugo Selo",
  },
  {
    distributionAreaId: 15,
    value: "118",
    name: "Pogon Sveta Klara",
  },
  {
    distributionAreaId: 16,
    value: "208",
    name: "Elektrodalmacija Split",
  },
  {
    distributionAreaId: 16,
    value: "161",
    name: "Pogon Brač",
  },
  {
    distributionAreaId: 16,
    value: "162",
    name: "Pogon Hvar",
  },
  {
    distributionAreaId: 16,
    value: "156",
    name: "Pogon Imotski",
  },
  {
    distributionAreaId: 16,
    value: "157",
    name: "Pogon Makarska",
  },
  {
    distributionAreaId: 16,
    value: "159",
    name: "Pogon Metković",
  },
  {
    distributionAreaId: 16,
    value: "153",
    name: "Pogon Omiš",
  },
  {
    distributionAreaId: 16,
    value: "158",
    name: "Pogon Ploče",
  },
  {
    distributionAreaId: 16,
    value: "198",
    name: "Pogon Sinj",
  },
  {
    distributionAreaId: 16,
    value: "164",
    name: "Pogon Trogir",
  },
  {
    distributionAreaId: 16,
    value: "160",
    name: "Pogon Vrgorac",
  },
  {
    distributionAreaId: 16,
    value: "163",
    name: "Pogonski ured Vis",
  },
  {
    distributionAreaId: 17,
    value: "130",
    name: "Pogon Buzet",
  },
  {
    distributionAreaId: 17,
    value: "132",
    name: "Pogon Labin",
  },
  {
    distributionAreaId: 17,
    value: "131",
    name: "Pogon Pazin",
  },
  {
    distributionAreaId: 17,
    value: "128",
    name: "Pogon Poreč",
  },
  {
    distributionAreaId: 17,
    value: "199",
    name: "Pogon Buje",
  },
  {
    distributionAreaId: 17,
    value: "121",
    name: "Pogon Pula",
  },
  {
    distributionAreaId: 17,
    value: "127",
    name: "Pogon Rovinj",
  },
  {
    distributionAreaId: 18,
    value: "DU",
    name: "Elektrojug Dubrovnik",
  },
  {
    distributionAreaId: 19,
    value: "GS",
    name: "Elektrolika Gospić",
  },
  {
    distributionAreaId: 19,
    value: "176",
    name: "Pogon Karlobag",
  },
  {
    distributionAreaId: 19,
    value: "195",
    name: "Pogon Otočac",
  },
  {
    distributionAreaId: 19,
    value: "189",
    name: "Pogon Plitvička Jezera",
  },
  {
    distributionAreaId: 20,
    value: "CL",
    name: "Cres - Lošinj",
  },
  {
    distributionAreaId: 20,
    value: "CR",
    name: "Crikvenica",
  },
  {
    distributionAreaId: 20,
    value: "KR",
    name: "Krk",
  },
  {
    distributionAreaId: 20,
    value: "OP",
    name: "Opatija",
  },
  {
    distributionAreaId: 20,
    value: "206",
    name: "Rab",
  },
  {
    distributionAreaId: 20,
    value: "RI",
    name: "Rijeka",
  },
  {
    distributionAreaId: 20,
    value: "SK",
    name: "Skrad",
  },
  {
    distributionAreaId: 21,
    value: "OS",
    name: "Sjedište",
  },
  {
    distributionAreaId: 21,
    value: "139",
    name: "Terenska jedinica Beli Manastir",
  },
  {
    distributionAreaId: 21,
    value: "142",
    name: "Terenska jedinica Donji Miholjac",
  },
  {
    distributionAreaId: 21,
    value: "122",
    name: "Terenska jedinica Đakovo",
  },
  {
    distributionAreaId: 21,
    value: "120",
    name: "Terenska jedinica Našice",
  },
  {
    distributionAreaId: 21,
    value: "117",
    name: "Terenska jedinica Orahovica",
  },
  {
    distributionAreaId: 21,
    value: "135",
    name: "Terenska jedinica Valpovo",
  },
];
