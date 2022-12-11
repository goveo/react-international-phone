import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import {
  getCountrySelector,
  getCountrySelectorDropdown,
  getCountrySelectorFlag,
  getDropdownArrow,
  getDropdownOption,
} from '../../utils/test-utils';
import { CountrySelector } from './CountrySelector';

describe('CountrySelector', () => {
  test('render CountrySelector', () => {
    render(<CountrySelector />);
    expect(getCountrySelector()).toBeVisible();
  });

  test('render country flag', () => {
    const { rerender } = render(<CountrySelector selectedCountry="ua" />);
    expect(getCountrySelectorFlag()).toBeVisible();
    expect(getCountrySelectorFlag()).toHaveAttribute('data-country', 'ua');
    rerender(<CountrySelector selectedCountry="es" />);
    expect(getCountrySelectorFlag()).toHaveAttribute('data-country', 'es');
  });

  test('open dropdown on click', () => {
    render(<CountrySelector />);
    fireEvent.click(getCountrySelector());
    expect(getCountrySelectorDropdown()).toBeVisible();
    expect(getDropdownOption('ua')).toBeVisible();
    expect(getDropdownOption('pl')).toBeVisible();
    expect(getDropdownOption('us')).toBeVisible();
  });

  test('change country with dropdown option', () => {
    const onSelect = jest.fn();
    const { rerender } = render(
      <CountrySelector selectedCountry="ua" onSelect={onSelect} />,
    );
    fireEvent.click(getCountrySelector());
    expect(getCountrySelectorDropdown()).toBeVisible();
    fireEvent.click(getDropdownOption('pl'));
    expect(getCountrySelectorDropdown()).not.toBeVisible();
    expect(onSelect.mock.calls.length).toBe(1);
    expect(onSelect.mock.calls[0][0]).toMatchObject({ name: 'Poland' });

    rerender(<CountrySelector selectedCountry="ua" />);
    fireEvent.click(getCountrySelector());
    fireEvent.click(getDropdownOption('pl'));
    // should not break if onSelect is not passed
    expect(getCountrySelector()).toBeVisible();
    expect(getCountrySelectorDropdown()).not.toBeVisible();
  });

  test('contain active class when open', () => {
    render(<CountrySelector />);
    fireEvent.click(getCountrySelector());
    expect(getCountrySelector().className).toMatch(/active/);
    expect(getDropdownArrow()?.className).toMatch(/active/);

    fireEvent.mouseDown(document.body);
    expect(getCountrySelector().className).not.toMatch(/active/);
    expect(getDropdownArrow()?.className).not.toMatch(/active/);
  });

  test('close dropdown on click outside', () => {
    render(<CountrySelector />);
    fireEvent.click(getCountrySelector());
    expect(getCountrySelectorDropdown()).toBeVisible();

    fireEvent.mouseDown(document.body);
    expect(getCountrySelectorDropdown()).not.toBeVisible();
  });

  test('close dropdown on click while dropdown is open', () => {
    render(<CountrySelector />);
    fireEvent.click(getCountrySelector());
    expect(getCountrySelectorDropdown()).toBeVisible();

    fireEvent.click(getCountrySelector());
    expect(getCountrySelectorDropdown()).not.toBeVisible();
  });

  test('close dropdown on escape press', () => {
    render(<CountrySelector />);
    fireEvent.click(getCountrySelector());
    fireEvent.focus(getDropdownOption('ua'));
    expect(getCountrySelectorDropdown()).toBeVisible();
    fireEvent.keyDown(getDropdownOption('ua'), {
      key: 'Escape',
      code: 'Escape',
      charCode: 27,
    });
    expect(getCountrySelectorDropdown()).not.toBeVisible();
  });

  test('select country option on enter press', () => {
    const onSelect = jest.fn();
    render(<CountrySelector selectedCountry="us" onSelect={onSelect} />);
    fireEvent.click(getCountrySelector());
    fireEvent.focus(getDropdownOption('ua'));
    expect(getCountrySelectorDropdown()).toBeVisible();
    fireEvent.keyDown(getDropdownOption('ua'), {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });
    expect(getCountrySelectorDropdown()).not.toBeVisible();
    expect(onSelect.mock.calls.length).toBe(1);
    expect(onSelect.mock.calls[0][0]).toMatchObject({ name: 'Ukraine' });
  });

  test('should set button wrapper with renderButtonWrapper', () => {
    render(
      <CountrySelector
        selectedCountry="us"
        renderButtonWrapper={({ children, onClick }) => (
          <div onClick={onClick} className="custom-wrapper">
            {children}
          </div>
        )}
      />,
    );
    let countrySelector = null;
    try {
      // Button should not be found
      countrySelector = screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'button';
      });
    } catch {
      expect(countrySelector).toBe(null);
    }

    countrySelector = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'div' &&
        element.className === 'custom-wrapper'
      );
    });

    expect(countrySelector).not.toBe(null);
    fireEvent.click(countrySelector);
    expect(getCountrySelectorDropdown()).toBeVisible();
  });
});
