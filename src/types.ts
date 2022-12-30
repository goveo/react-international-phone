type Region = 'america' | 'europe' | 'asia' | 'oceania' | 'africa';
type SubRegion =
  | 'north-america'
  | 'south-america'
  | 'central-america'
  | 'carribean'
  | 'eu-union'
  | 'ex-ussr'
  | 'ex-yugos'
  | 'baltic'
  | 'middle-east'
  | 'north-africa';

export type CountryIso2 =
  | 'af'
  | 'al'
  | 'dz'
  | 'ad'
  | 'ao'
  | 'ag'
  | 'ar'
  | 'am'
  | 'aw'
  | 'au'
  | 'at'
  | 'az'
  | 'bs'
  | 'bh'
  | 'bd'
  | 'bb'
  | 'by'
  | 'be'
  | 'bz'
  | 'bj'
  | 'bt'
  | 'bo'
  | 'ba'
  | 'bw'
  | 'br'
  | 'io'
  | 'bn'
  | 'bg'
  | 'bf'
  | 'bi'
  | 'kh'
  | 'cm'
  | 'ca'
  | 'cv'
  | 'bq'
  | 'cf'
  | 'td'
  | 'cl'
  | 'cn'
  | 'co'
  | 'km'
  | 'cd'
  | 'cg'
  | 'cr'
  | 'ci'
  | 'hr'
  | 'cu'
  | 'cw'
  | 'cy'
  | 'cz'
  | 'dk'
  | 'dj'
  | 'dm'
  | 'do'
  | 'ec'
  | 'eg'
  | 'sv'
  | 'gq'
  | 'er'
  | 'ee'
  | 'et'
  | 'fj'
  | 'fi'
  | 'fr'
  | 'gf'
  | 'pf'
  | 'ga'
  | 'gm'
  | 'ge'
  | 'de'
  | 'gh'
  | 'gr'
  | 'gd'
  | 'gp'
  | 'gu'
  | 'gt'
  | 'gn'
  | 'gw'
  | 'gy'
  | 'ht'
  | 'hn'
  | 'hk'
  | 'hu'
  | 'is'
  | 'in'
  | 'id'
  | 'ir'
  | 'iq'
  | 'ie'
  | 'il'
  | 'it'
  | 'jm'
  | 'jp'
  | 'jo'
  | 'kz'
  | 'ke'
  | 'ki'
  | 'xk'
  | 'kw'
  | 'kg'
  | 'la'
  | 'lv'
  | 'lb'
  | 'ls'
  | 'lr'
  | 'ly'
  | 'li'
  | 'lt'
  | 'lu'
  | 'mo'
  | 'mk'
  | 'mg'
  | 'mw'
  | 'my'
  | 'mv'
  | 'ml'
  | 'mt'
  | 'mh'
  | 'mq'
  | 'mr'
  | 'mu'
  | 'mx'
  | 'fm'
  | 'md'
  | 'mc'
  | 'mn'
  | 'me'
  | 'ma'
  | 'mz'
  | 'mm'
  | 'na'
  | 'nr'
  | 'np'
  | 'nl'
  | 'nc'
  | 'nz'
  | 'ni'
  | 'ne'
  | 'ng'
  | 'kp'
  | 'no'
  | 'om'
  | 'pk'
  | 'pw'
  | 'ps'
  | 'pa'
  | 'pg'
  | 'py'
  | 'pe'
  | 'ph'
  | 'pl'
  | 'pt'
  | 'pr'
  | 'qa'
  | 're'
  | 'ro'
  | 'ru'
  | 'rw'
  | 'kn'
  | 'lc'
  | 'vc'
  | 'ws'
  | 'sm'
  | 'st'
  | 'sa'
  | 'sn'
  | 'rs'
  | 'sc'
  | 'sl'
  | 'sg'
  | 'sk'
  | 'si'
  | 'sb'
  | 'so'
  | 'za'
  | 'kr'
  | 'ss'
  | 'es'
  | 'lk'
  | 'sd'
  | 'sr'
  | 'sz'
  | 'se'
  | 'ch'
  | 'sy'
  | 'tw'
  | 'tj'
  | 'tz'
  | 'th'
  | 'tl'
  | 'tg'
  | 'to'
  | 'tt'
  | 'tn'
  | 'tr'
  | 'tm'
  | 'tv'
  | 'ug'
  | 'ua'
  | 'ae'
  | 'gb'
  | 'us'
  | 'uy'
  | 'uz'
  | 'vu'
  | 'va'
  | 've'
  | 'vn'
  | 'ye'
  | 'zm'
  | 'zw';

type BaseCountryData = [
  string, // country name
  Array<Region | SubRegion>, // regions
  CountryIso2, // iso2 code
  string, // international dial code
];

type CountryDataWithFormat = [
  ...BaseCountryData,
  string, // format
];

type CountryDataWithOrder = [
  ...CountryDataWithFormat,
  number, // order priority
];

type CountryDataAreaCodes = [
  ...CountryDataWithOrder,
  string[], // area codes
];

export type CountryData =
  | BaseCountryData
  | CountryDataWithFormat
  | CountryDataWithOrder
  | CountryDataAreaCodes;

export interface ParsedCountry {
  name: CountryData[0];
  regions: CountryData[1];
  iso2: CountryData[2];
  dialCode: CountryData[3];
  format: CountryData[4];
  priority: CountryData[5];
  areaCodes: CountryData[6];
}

export interface CountryGuessResult {
  country: ParsedCountry | undefined;
  fullDialCodeMatch: boolean;
  areaCodeMatch: boolean | undefined;
}

export type RequiredType<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};
