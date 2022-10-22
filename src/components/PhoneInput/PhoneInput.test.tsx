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
  }) as HTMLUListElement;

describe('PhoneInput', () => {
  test('should render placeholder', () => {
    const { rerender } = render(<PhoneInput placeholder="Phone input" />);
    expect(getInput()).toHaveProperty('placeholder', 'Phone input');

    rerender(<PhoneInput placeholder="Test placeholder" />);
    expect(getInput()).toHaveProperty('placeholder', 'Test placeholder');
  });

  test('should set flag to country selector', () => {
    render(<PhoneInput phone="+380" initialCountry="ua" />);
    expect(getCountrySelector()).toHaveAttribute('title', 'Ukraine');
  });

  test('should format value', () => {
    render(<PhoneInput phone="+380" initialCountry="ua" />);

    fireEvent.change(getInput(), { target: { value: '380991234567' } });
    expect(getInput().value).toBe('+380 (99) 123 45 67');

    fireEvent.change(getInput(), { target: { value: '+12345678900' } });
    expect(getInput().value).toBe('+1 (234) 567-8900');
  });

  test('should update country on input', () => {
    render(<PhoneInput phone="+380" initialCountry="ua" />);
    fireEvent.change(getInput(), { target: { value: '+12345678900' } });
    expect(getCountrySelector()).toHaveAttribute('data-country', 'us');

    fireEvent.change(getInput(), { target: { value: '+12345678900' } });
    expect(getCountrySelector()).toHaveAttribute('data-country', 'us');
  });

  test('should open country selector dropdown', () => {
    render(<PhoneInput phone="+380" initialCountry="ua" />);
    expect(getCountrySelectorDropdown()).not.toBeVisible();
    fireEvent.click(getCountrySelector());
    expect(getCountrySelectorDropdown()).toBeVisible();
  });

  test('should select country from dropdown', () => {
    render(<PhoneInput phone="+380" initialCountry="ua" />);
    fireEvent.click(getCountrySelector());
    fireEvent.click(getDropdownOption('af'));
    expect(getCountrySelector()).toHaveAttribute('data-country', 'af');
    expect(getInput().value).toBe('+93 ');
  });

  test('should support disabled state', () => {
    const { rerender } = render(
      <PhoneInput phone="+380" initialCountry="ua" />,
    );
    expect(getCountrySelector()).toHaveProperty('disabled', false);
    expect(getInput()).toHaveProperty('disabled', false);

    rerender(<PhoneInput placeholder="Test placeholder" disabled />);
    expect(getCountrySelector()).toHaveProperty('disabled', true);
    expect(getInput()).toHaveProperty('disabled', true);
  });
});
