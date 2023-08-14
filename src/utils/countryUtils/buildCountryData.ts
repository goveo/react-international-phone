import { CountryData, ParsedCountry } from '../../types';

export const buildCountryData = (parsedCountry: ParsedCountry): CountryData => {
  const { name, iso2, dialCode, format, priority, areaCodes } = parsedCountry;

  const countryData = [
    name,
    iso2,
    dialCode,
    format,
    priority,
    areaCodes,
  ] as const;

  // validate countryData array
  for (let i = 0; i < countryData.length; i += 1) {
    if (i === 0) continue; // skip first item

    const prevValue = countryData[i - 1];
    const currentValue = countryData[i];

    // undefined values should go 1 by 1 in the end
    // can not pass [..., 'data', undefined, 'data', ...]
    if (prevValue === undefined && currentValue !== undefined) {
      // JSON.stringify converts undefined to null
      const stringifiedCountry = JSON.stringify(countryData, (_k, v) =>
        v === undefined ? '__undefined' : v,
      ).replace(/"__undefined"/g, 'undefined');

      throw new Error(
        `[react-international-phone] invalid country values passed to buildCountryData. Check ${prevValue} in: ${stringifiedCountry}`,
      );
    }
  }

  return countryData.filter((v) => v !== undefined) as CountryData;
};
