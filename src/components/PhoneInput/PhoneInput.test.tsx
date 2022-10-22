import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { CountryIso2 } from '../../types';
import { PhoneInput } from './PhoneInput';

const getInput = () =>
  screen.getByText(
    (content, element) => element?.tagName.toLowerCase() === 'input',
  ) as HTMLInputElement;

const getCountrySelector = () =>
  screen.getByText((content, element) => {
    return element?.tagName.toLowerCase() === 'button';
  });

const getCountrySelectorDropdown = () =>
  screen.getByText((content, element) => {
    return element?.tagName.toLowerCase() === 'ul';
  }) as HTMLUListElement;

const getDropdownOption = (country: CountryIso2) =>
  screen.getByText((content, element) => {
    return (
      element?.tagName.toLowerCase() === 'li' &&
      element.getAttribute('data-country') === country
    );
  }) as HTMLLIElement;

const getDropdownArrow = () => {
  try {
    return screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'div' &&
        element?.className.includes('dropdown-arrow')
      );
    }) as HTMLDivElement;
  } catch (error) {
    return null;
  }
};

const getDialCodePreview = () => {
  try {
    return screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'div' &&
        element?.className.includes('dial-code-preview')
      );
    }) as HTMLDivElement;
  } catch (error) {
    return null;
  }
};

describe('PhoneInput', () => {
  test('should set phone value', () => {
    render(<PhoneInput phone="+38099109" initialCountry="ua" />);
    expect(getInput().value).toBe('+380 (99) 109 ');
  });

  test('should set flag to country selector', () => {
    render(<PhoneInput phone="+380" initialCountry="ua" />);
    expect(getCountrySelector()).toHaveAttribute('title', 'Ukraine');
  });

  test('should format value', () => {
    render(<PhoneInput initialCountry="ua" />);

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
    const { rerender } = render(<PhoneInput placeholder="Phone input" />);
    expect(getInput()).toHaveProperty('placeholder', 'Phone input');

    rerender(<PhoneInput placeholder="Test placeholder" />);
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

  test('should handle insertSpaceAfterDialCode', () => {
    const { rerender } = render(
      <PhoneInput initialCountry="us" insertSpaceAfterDialCode />,
    );
    fireEvent.change(getInput(), { target: { value: '12345678900' } });
    expect(getInput().value).toBe('+1 (234) 567-8900');

    rerender(
      <PhoneInput initialCountry="us" insertSpaceAfterDialCode={false} />,
    );
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
      <PhoneInput phone="12345678900" initialCountry="us" forceDialCode />,
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

  test('should handle showDisabledDialCodeAndPrefix	', () => {
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
});
