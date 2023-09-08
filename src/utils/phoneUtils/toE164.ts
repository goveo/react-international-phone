import { ParsedCountry } from '../../types';
import { removeNonDigits } from '../common';

export const toE164 = ({
  displayPhone,
  country,
  disableDialCodeAndPrefix,
  allowEmpty,
}: {
  displayPhone: string;
  country: ParsedCountry;
  disableDialCodeAndPrefix?: boolean;
  allowEmpty?: boolean;
}) => {
  if (!displayPhone)
    return allowEmpty
      ? ''
      : `+${country.dialCode}${removeNonDigits(displayPhone)}`;

  if (disableDialCodeAndPrefix) {
    return displayPhone.startsWith(`+${country.dialCode}`)
      ? `+${removeNonDigits(displayPhone)}`
      : `+${country.dialCode}${removeNonDigits(displayPhone)}`;
  }

  return `+${removeNonDigits(displayPhone)}`;
};
