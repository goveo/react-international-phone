import type { ValidatePhoneConfig } from '../utils';
import { validatePhone } from '../utils';

export const usePhoneValidation = (
  phone: string,
  config?: ValidatePhoneConfig,
) => {
  return validatePhone(phone, config);
};
