// distribution area
const data =
  "<option value='bjelovar'>Elektra Bjelovar</option><option value='cakovec'>Elektra Čakovec</option><option value='karlovac'>Elektra Karlovac</option><option value='koprivnica'>Elektra Koprivnica</option><option value='kriz'>Elektra Križ</option><option value='pozega'>Elektra Požega</option><option value='sisak'>Elektra Sisak</option><option value='sbrod'>Elektra Slavonski Brod</option><option value='sibenik'>Elektra Šibenik</option><option value='varazdin'>Elektra Varaždin</option><option value='vinkovci'>Elektra Vinkovci</option><option value='virovitica'>Elektra Virovitica</option><option value='zabok'>Elektra Zabok</option><option value='zadar'>Elektra Zadar</option><option value='zagreb'>Elektra Zagreb</option><option value='split'>Elektrodalmacija Split</option><option value='pula'>Elektroistra Pula</option><option value='dubrovnik'>Elektrojug Dubrovnik</option><option value='gospic'>Elektrolika Gospić</option><option value='rijeka'>Elektroprimorje Rijeka</option><option value='osijek'>Elektroslavonija Osijek</option>";

const scrappedValues = data
  .split("value='")
  .map((val) => val.substring(0, val.indexOf("'>")))
  .filter(Boolean);
const scrappedNames = data
  .split(">")
  .map((val) => val.substring(0, val.indexOf("</")))
  .filter(Boolean);

let distId = 1;

const mapped = scrappedValues.map((value, index) => {
  const data = {
    id: distId,
    value: value,
    name: scrappedNames[index],
  };

  distId += 1;

  return data;
});

// power plants
const plants = [
  "<option value='BJ'>Elektra Bjelovar</option><option value='126'>Pogon Križevci</option>",
  "<option value='CK'>Elektra Čakovec</option>",
  "<option value='172'>Duga Resa</option><option value='171'>Jastrebarsko</option><option value='KA'>Karlovac</option><option value='169'>Ogulin</option><option value='168'>Ozalj</option>",
  "<option value='124'>Đurđevac</option><option value='123'>Koprivnica</option><option value='125'>Ludbreg</option>",
  "<option value='KZ'>Elektra Križ</option><option value='116'>Pogon Daruvar</option><option value='112'>Pogon Kutina</option><option value='104'>Pogon Lipik</option>",
  "<option value='PO'>Elektra Požega</option>",
  "<option value='150'>Pogon Dvor na Uni</option><option value='146'>Pogon Glina</option><option value='149'>Pogon Hrvatska Kostajnica</option><option value='145'>Pogon Petrinja</option><option value='148'>Pogon Sunja</option><option value='147'>Pogon Topusko</option><option value='SI'>Sjedište Elektre Sisak</option>",
  "<option value='SB'>Elektra Slavonski Brod</option><option value='137'>Nova Gradiška</option>",
  "<option value='SIB'>Elektra Šibenik</option><option value='107'>Pogon Drniš</option><option value='106'>Pogon Knin</option>",
  "<option value='108'>Pogon Ivanec</option><option value='109'>Pogon Novi Marof</option><option value='134'>Pogonski ured Vinica</option><option value='VZ'>Sjedište Varaždin</option>",
  "<option value='VI'>Elektra Vinkovci</option>",
  "<option value='VIR'>Elektra Virovitica</option><option value='151'>Slatina</option>",
  "<option value='193'>Pregrada</option><option value='ZB'>Zabok</option><option value='194'>Zlatar Bistrica</option>",
  "<option value='ZD'>Elektra Zadar</option>",
  "<option value='ZG'>Elektra Zagreb</option><option value='115'>Pogon  Samobor</option><option value='114'>Pogon  Velika Gorica</option><option value='177'>Pogon  Zaprešić</option><option value='113'>Pogon  Zelina</option><option value='187'>Pogon Dugo Selo</option><option value='118'>Pogon Sveta Klara</option>",
  "<option value='208'>Elektrodalmacija Split</option><option value='161'>Pogon Brač</option><option value='162'>Pogon Hvar</option><option value='156'>Pogon Imotski</option><option value='157'>Pogon Makarska</option><option value='159'>Pogon Metković</option><option value='153'>Pogon Omiš</option><option value='158'>Pogon Ploče</option><option value='198'>Pogon Sinj</option><option value='164'>Pogon Trogir</option><option value='160'>Pogon Vrgorac</option><option value='163'>Pogonski ured Vis</option>",
  "<option value='130'>Pogon  Buzet</option><option value='132'>Pogon  Labin</option><option value='131'>Pogon  Pazin</option><option value='128'>Pogon  Poreč</option><option value='199'>Pogon Buje</option><option value='121'>Pogon Pula</option><option value='127'>Pogon Rovinj</option>",
  "<option value='DU'>Elektrojug Dubrovnik</option>",
  "<option value='GS'>Elektrolika Gospić</option><option value='176'>Pogon Karlobag</option><option value='195'>Pogon Otočac</option><option value='189'>Pogon Plitvička Jezera</option>",
  "<option value='CL'>Cres - Lošinj</option><option value='CR'>Crikvenica</option><option value='KR'>Krk</option><option value='OP'>Opatija</option><option value='206'>Rab</option><option value='RI'>Rijeka</option><option value='SK'>Skrad</option>",
  "<option value='OS'>Sjedište</option><option value='139'>Terenska jedinica Beli Manastir</option><option value='142'>Terenska jedinica Donji Miholjac</option><option value='122'>Terenska jedinica Đakovo</option><option value='120'>Terenska jedinica Našice</option><option value='117'>Terenska jedinica Orahovica</option><option value='135'>Terenska jedinica Valpovo</option>",
];

let areaId = 1;

const scrapped = plants.map((value) => {
  const scrappedValues = value
    .split("value='")
    .map((val) => val.substring(0, val.indexOf("'>")))
    .filter(Boolean);
  const scrappedNames = value
    .split(">")
    .map((val) => val.substring(0, val.indexOf("</")))
    .filter(Boolean);

  const mapped = scrappedValues.map((value, index) => {
    return {
      distributionAreaId: areaId,
      value: value,
      name: scrappedNames[index].replace("  ", " "),
    };
  });

  areaId += 1;

  return mapped;
});

console.log(
  "MAPPED",
  scrapped.reduce((acc, curr) => acc.concat(curr), [])
);
