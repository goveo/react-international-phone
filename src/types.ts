type Region = "america" | "europe" | "asia" | "oceania" | "africa";
type SubRegion =
  | "north-america"
  | "south-america"
  | "central-america"
  | "carribean"
  | "eu-union"
  | "ex-ussr"
  | "ex-yugos"
  | "baltic"
  | "middle-east"
  | "north-africa";

type BaseCountryData = [
  string, // country name
  Array<Region | SubRegion>, // regions
  string, // iso2 code
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

export type CountryData =
  | BaseCountryData
  | CountryDataWithFormat
  | CountryDataWithOrder;

export interface ParsedCountry {
  name: CountryData[0];
  regions: CountryData[1];
  iso2: CountryData[2];
  dialCode: CountryData[3];
  format: CountryData[4];
  priority: CountryData[5];
}
