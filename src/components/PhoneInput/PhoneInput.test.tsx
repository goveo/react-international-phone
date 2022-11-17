import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { defaultCountries } from '../../data/countryData';
import { parseCountry } from '../../utils';
import { buildCountryData } from '../../utils/countryUtils/buildCountryData';
import {
  getCountrySelector,
  getCountrySelectorDropdown,
  getDialCodePreview,
  getDropdownArrow,
  getDropdownOption,
  getInput,
  getSystemTimerIncreaseFunc,
} from '../../utils/test-utils';
import { PhoneInput } from './PhoneInput';

const increaseSystemTime = getSystemTimerIncreaseFunc();

export const fireChangeEvent = (
  value: string,
  {
    isDeletion,
    increaseSystemTimeMs,
  }: { isDeletion?: boolean; increaseSystemTimeMs?: number } = {},
) => {
  fireEvent.change(getInput(), {
    target: { value },
    nativeEvent: { inputType: isDeletion ? 'delete' : 'another-type' },
  });
  if (increaseSystemTimeMs) {
    increaseSystemTime(increaseSystemTimeMs);
  }
};

describe('PhoneInput', () => {
  test('should set phone value', () => {
    render(<PhoneInput value="+38099109" initialCountry="ua" />);
    expect(getInput().value).toBe('+380 (99) 109 ');
  });

  test('should handle onChange call', () => {
    const onChange = jest.fn();
    render(<PhoneInput initialCountry="ua" onChange={onChange} />);

    fireEvent.change(getInput(), { target: { value: '38099' } });
    expect(onChange.mock.calls.length).toBe(1);
    expect(onChange.mock.calls[0][0]).toBe('+380 (99) ');

    fireEvent.change(getInput(), { target: { value: '+380 (99) 999' } });
    expect(onChange.mock.calls.length).toBe(2);
    expect(onChange.mock.calls[1][0]).toBe('+380 (99) 999 ');

    fireEvent.change(getInput(), { target: { value: '' } });
    expect(onChange.mock.calls.length).toBe(3);
    expect(onChange.mock.calls[2][0]).toBe('');

    fireEvent.change(getInput(), { target: { value: '+1 403 555-6666' } });
    expect(onChange.mock.calls.length).toBe(4);
    expect(onChange.mock.calls[3][0]).toBe('+1 (403) 555-6666');
  });

  test('should set flag to country selector', () => {
    render(<PhoneInput value="+380" initialCountry="ua" />);
    expect(getCountrySelector()).toHaveAttribute('title', 'Ukraine');
  });

  test('should format value', () => {
    render(<PhoneInput initialCountry="ua" value="380" />);

    fireEvent.change(getInput(), { target: { value: '380991234567' } });
    expect(getInput().value).toBe('+380 (99) 123 45 67');

    fireEvent.change(getInput(), { target: { value: '+12345678900' } });
    expect(getInput().value).toBe('+1 (234) 567-8900');
  });

  test('should update country on input', () => {
    render(<PhoneInput initialCountry="ua" />);
    fireEvent.change(getInput(), { target: { value: '+12345678900' } });
    expect(getCountrySelector()).toHaveAttribute('data-country', 'us');

    fireEvent.change(getInput(), { target: { value: '+12345678900' } });
    expect(getCountrySelector()).toHaveAttribute('data-country', 'us');
  });

  test('should open country selector dropdown', () => {
    render(<PhoneInput initialCountry="ua" />);
    expect(getCountrySelectorDropdown()).not.toBeVisible();
    fireEvent.click(getCountrySelector());
    expect(getCountrySelectorDropdown()).toBeVisible();
  });

  test('should select country from dropdown', () => {
    render(<PhoneInput initialCountry="ua" />);
    fireEvent.click(getCountrySelector());
    fireEvent.click(getDropdownOption('af'));
    expect(getCountrySelector()).toHaveAttribute('data-country', 'af');
    expect(getInput().value).toBe('+93 ');
  });

  test('should support disabled state', () => {
    const { rerender } = render(<PhoneInput initialCountry="ua" />);
    expect(getCountrySelector()).toHaveProperty('disabled', false);
    expect(getInput()).toHaveProperty('disabled', false);

    rerender(<PhoneInput initialCountry="ua" disabled />);
    expect(getCountrySelector()).toHaveProperty('disabled', true);
    expect(getInput()).toHaveProperty('disabled', true);

    rerender(
      <PhoneInput
        initialCountry="ua"
        disabled
        showDisabledDialCodeAndPrefix
        disableDialCodeAndPrefix
      />,
    );
    expect(getCountrySelector()).toHaveProperty('disabled', true);
    expect(getInput()).toHaveProperty('disabled', true);
    expect(getDialCodePreview()?.className).toMatch(/disabled/);
  });

  test('should hide dropdown icon when hideDropdown is true', () => {
    const { rerender } = render(<PhoneInput initialCountry="ua" />);
    expect(getDropdownArrow()).toBeVisible();

    rerender(<PhoneInput initialCountry="ua" hideDropdown />);
    expect(getDropdownArrow()).toBeNull();
  });

  test('should set initial country', () => {
    render(<PhoneInput initialCountry="tw" />);
    expect(getCountrySelector()).toHaveAttribute('data-country', 'tw');
    expect(getInput().value).toBe('+886 ');
  });

  test('should render placeholder', () => {
    const { rerender } = render(
      <PhoneInput
        initialCountry="us"
        disableDialCodePrefill
        placeholder="Phone input"
      />,
    );
    expect(getInput()).toHaveProperty('placeholder', 'Phone input');

    rerender(
      <PhoneInput
        initialCountry="us"
        disableDialCodePrefill
        placeholder="Test placeholder"
      />,
    );
    expect(getInput()).toHaveProperty('placeholder', 'Test placeholder');
  });

  test('should handle defaultMask value', () => {
    render(<PhoneInput initialCountry="us" defaultMask="....-....-...." />);
    fireEvent.change(getInput(), { target: { value: '12345678900' } });
    expect(getInput().value).toBe('+1 (234) 567-8900');

    // Albania does not have a defined mask
    fireEvent.change(getInput(), { target: { value: '+355123456789000' } });
    expect(getInput().value).toBe('+355 1234-5678-9000');
  });

  test('should handle hideSpaceAfterDialCode', () => {
    const { rerender } = render(
      <PhoneInput initialCountry="us" hideSpaceAfterDialCode={false} />,
    );
    fireEvent.change(getInput(), { target: { value: '12345678900' } });
    expect(getInput().value).toBe('+1 (234) 567-8900');

    rerender(<PhoneInput initialCountry="us" hideSpaceAfterDialCode={true} />);
    fireEvent.change(getInput(), { target: { value: '12345678900' } });
    expect(getInput().value).toBe('+1(234) 567-8900');
  });

  test('should handle disableCountryGuess', () => {
    render(<PhoneInput initialCountry="us" disableCountryGuess />);
    fireEvent.change(getInput(), { target: { value: '38099123456' } });
    expect(getInput().value).toBe('+3 (809) 912-3456');
  });

  test('should handle disableDialCodePrefill', () => {
    render(<PhoneInput initialCountry="us" disableDialCodePrefill />);
    expect(getInput().value).toBe('');
  });

  test('should handle forceDialCode', () => {
    render(
      <PhoneInput value="12345678900" initialCountry="us" forceDialCode />,
    );
    expect(getInput().value).toBe('+1 (234) 567-8900');

    fireEvent.change(getInput(), { target: { value: '' } });
    expect(getInput().value).toBe('+1 ');

    fireEvent.change(getInput(), { target: { value: '+' } });
    expect(getInput().value).toBe('+1 ');
  });

  test('should handle disableDialCodeAndPrefix', () => {
    const { rerender } = render(
      <PhoneInput initialCountry="us" disableDialCodeAndPrefix />,
    );
    fireEvent.change(getInput(), { target: { value: '1234567890' } });
    expect(getInput().value).toBe('(123) 456-7890');

    fireEvent.change(getInput(), { target: { value: '' } });
    expect(getInput().value).toBe('');

    fireEvent.change(getInput(), { target: { value: '+123' } });
    expect(getInput().value).toBe('(123) ');

    // should ignore disableCountryGuess and forceDialCode
    rerender(
      <PhoneInput
        initialCountry="us"
        disableDialCodeAndPrefix
        forceDialCode
        disableCountryGuess={false}
      />,
    );

    fireEvent.change(getInput(), { target: { value: '1234567890' } });
    expect(getInput().value).toBe('(123) 456-7890');

    fireEvent.change(getInput(), { target: { value: '' } });
    expect(getInput().value).toBe('');

    fireEvent.change(getInput(), { target: { value: '+38099' } });
    expect(getInput().value).toBe('(380) 99');
  });

  test('should handle showDisabledDialCodeAndPrefix', () => {
    const { rerender } = render(
      <PhoneInput initialCountry="us" disableDialCodeAndPrefix />,
    );
    fireEvent.change(getInput(), { target: { value: '1234567890' } });
    expect(getDialCodePreview()).toBeNull();

    rerender(
      <PhoneInput
        initialCountry="us"
        disableDialCodeAndPrefix
        showDisabledDialCodeAndPrefix
      />,
    );
    expect(getDialCodePreview()).toBeVisible();
    expect(getDialCodePreview()?.textContent).toBe('+1');
  });

  test('should support undo on ctrl+z', () => {
    render(<PhoneInput initialCountry="us" value="+1234" />);
    increaseSystemTime();

    fireChangeEvent('1234567890');
    fireEvent.keyDown(getInput(), {
      key: 'Z',
      code: 'KeyZ',
      ctrlKey: true,
      shiftKey: false,
    });

    expect(getInput().value).toBe('+1 (234) ');

    fireChangeEvent('123456');
    fireChangeEvent('12345678');

    fireEvent.keyDown(getInput(), {
      key: 'Z',
      code: 'KeyZ',
      ctrlKey: true,
      shiftKey: false,
    });
    expect(getInput().value).toBe('+1 (234) 56');

    fireEvent.keyDown(getInput(), {
      key: 'Z',
      code: 'KeyZ',
      ctrlKey: true,
      shiftKey: false,
    });
    expect(getInput().value).toBe('+1 (234) ');

    // not valid event
    fireEvent.keyDown(getInput(), {
      key: 'Z',
      code: 'KeyZ',
      ctrlKey: false,
      shiftKey: false,
    });
    expect(getInput().value).toBe('+1 (234) ');
  });

  test('should support redo on ctrl+shift+z', () => {
    render(<PhoneInput initialCountry="us" value="+1234" />);
    increaseSystemTime();

    fireChangeEvent('1234567890');
    fireChangeEvent('12345678');

    fireEvent.keyDown(getInput(), {
      key: 'Z',
      code: 'KeyZ',
      ctrlKey: true,
      shiftKey: false,
    });
    expect(getInput().value).toBe('+1 (234) 567-890');

    fireEvent.keyDown(getInput(), {
      key: 'Z',
      code: 'KeyZ',
      ctrlKey: true,
      shiftKey: true,
    });
    expect(getInput().value).toBe('+1 (234) 567-8');

    // not valid event
    fireEvent.keyDown(getInput(), {
      key: 'Z',
      code: 'KeyZ',
      ctrlKey: false,
      shiftKey: true,
    });
    expect(getInput().value).toBe('+1 (234) 567-8');
  });

  test('should support countries filtering', () => {
    const countries = defaultCountries.filter((country) => {
      const { iso2 } = parseCountry(country);
      return ['us', 'ua', 'cz'].includes(iso2);
    });

    render(
      <PhoneInput initialCountry="us" value="+1234" countries={countries} />,
    );

    expect(getCountrySelectorDropdown().childNodes.length).toBe(
      countries.length,
    );

    fireChangeEvent('44444');

    // not supported country was not set (+44 should set uk by default)
    expect(getInput().value).toBe('+4 (444) 4');
    expect(getCountrySelector()).toHaveAttribute('title', 'United States');

    fireChangeEvent('420123');
    expect(getInput().value).toBe('+420 123 ');
    expect(getCountrySelector()).toHaveAttribute('title', 'Czech Republic');

    fireChangeEvent('555555');
    expect(getInput().value).toBe('+555 555 ');
    expect(getCountrySelector()).toHaveAttribute('title', 'Czech Republic');
  });

  test('should support country modifying', () => {
    const countries = defaultCountries.map((country) => {
      const parsedCountry = parseCountry(country);
      if (parsedCountry.iso2 === 'ua') {
        return buildCountryData({ ...parsedCountry, format: '(..) ... ....' });
      }
      return country;
    });

    render(
      <PhoneInput
        initialCountry="ua"
        value="+380(99)9999999"
        countries={countries}
      />,
    );
    expect(getInput().value).toBe('+380 (99) 999 9999');
  });
});
