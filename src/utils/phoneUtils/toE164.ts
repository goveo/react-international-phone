import { ParsedCountry } from '../../types';
import { removeNonDigits } from '../common';

export const toE164 = ({
  displayPhone,
  country,
  disableDialCodeAndPrefix,
}: {
  displayPhone: string;
  country: ParsedCountry;
  disableDialCodeAndPrefix?: boolean;
}) => {
  if (!displayPhone) return '';

  if (disableDialCodeAndPrefix) {
    return displayPhone.startsWith(`+${country.dialCode}`)
      ? `+${removeNonDigits(displayPhone)}`
      : `+${country.dialCode}${removeNonDigits(displayPhone)}`;
  }

  return `+${removeNonDigits(displayPhone)}`;
};
