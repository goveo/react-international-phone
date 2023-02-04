import { renderHook } from '@testing-library/react-hooks/dom';

import { defaultCountries } from '../../data/countryData';
import { parseCountry, validatePhone, ValidatePhoneConfig } from '../../utils';
import * as validatePhoneModule from '../../utils/phoneUtils/validatePhone';
import { usePhoneValidation } from '../usePhoneValidation';

describe('usePhoneValidation', () => {
  const validatePhoneSpy = jest.spyOn(validatePhoneModule, 'validatePhone');

  it('should call validatePhone util function', () => {
    const phone = '+1 (444) 444-4444';
    const config: ValidatePhoneConfig = {
      prefix: '',
      charAfterDialCode: '_',
      defaultMask: '.... .... ...',
      defaultMaskMinPhoneLength: 9,
      countries: defaultCountries.filter((c) => {
        return ['ua', 'us', 'uk'].includes(parseCountry(c).iso2);
      }),
    };

    const { result: validationResult } = renderHook(() =>
      usePhoneValidation(phone, config),
    );

    expect(validatePhoneSpy).toBeCalledTimes(1);
    expect(validatePhoneSpy.mock.calls[0][0]).toBe(phone);
    expect(validatePhoneSpy.mock.calls[0][1]).toMatchObject(config);

    expect(validatePhone(phone, config)).toMatchObject(
      validationResult.current,
    );
  });
});
