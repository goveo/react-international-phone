import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { defaultCountries } from '../../data/countryData';
import {
  getCountryFlag,
  getCountrySelectorDropdown,
  getDropdownOption,
} from '../../utils/test-utils';
import { CountrySelectorDropdown } from './CountrySelectorDropdown';

describe('CountrySelectorDropdown', () => {
  test('render CountrySelectorDropdown', () => {
    render(<CountrySelectorDropdown show={true} />);
    expect(getCountrySelectorDropdown()).toBeVisible();
  });

  test('hide dropdown on show=false', () => {
    render(<CountrySelectorDropdown show={false} />);
    expect(getCountrySelectorDropdown()).not.toBeVisible();
    expect(getCountrySelectorDropdown()).toBeInTheDocument();
  });

  test('render country options', () => {
    render(<CountrySelectorDropdown show={true} />);
    expect(getDropdownOption('af')).toBeVisible();
    expect(getDropdownOption('us')).toBeVisible();
    expect(getDropdownOption('ua')).toBeVisible();
    expect(getDropdownOption('pl')).toBeVisible();
    expect(getDropdownOption('pl')).toHaveTextContent('Poland');
    expect(getDropdownOption('pl')).toHaveTextContent('+48');
    expect(getCountrySelectorDropdown().childNodes.length).toBe(
      defaultCountries.length,
    );
  });

  test('country option should show correct info', () => {
    render(<CountrySelectorDropdown show={true} />);
    expect(getDropdownOption('pl')).toHaveTextContent('Poland');
    expect(getDropdownOption('pl')).toHaveTextContent('+48');
    expect(getDropdownOption('pl')).toContainElement(getCountryFlag('pl'));

    expect(getDropdownOption('ua')).toHaveTextContent('Ukraine');
    expect(getDropdownOption('ua')).toHaveTextContent('+380');
    expect(getDropdownOption('ua')).toContainElement(getCountryFlag('ua'));
  });

  test('should select country on click', () => {
    const onSelect = jest.fn();
    const { rerender } = render(
      <CountrySelectorDropdown show={true} onSelect={onSelect} />,
    );
    fireEvent.click(getDropdownOption('ua'));
    expect(onSelect.mock.calls.length).toBe(1);
    expect(onSelect.mock.calls[0][0]).toMatchObject({ name: 'Ukraine' });

    // should not break without passing a callback
    rerender(<CountrySelectorDropdown show={true} />);
    fireEvent.click(getDropdownOption('ua'));
    expect(getCountrySelectorDropdown()).toBeVisible();
  });

  test('should select country on enter press', () => {
    const onSelect = jest.fn();
    const { rerender } = render(
      <CountrySelectorDropdown show={true} onSelect={onSelect} />,
    );
    fireEvent.keyDown(getDropdownOption('ua'), {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });
    expect(onSelect.mock.calls.length).toBe(1);
    expect(onSelect.mock.calls[0][0]).toMatchObject({ name: 'Ukraine' });

    // should not break without passing a callback
    rerender(<CountrySelectorDropdown show={true} />);
    fireEvent.keyDown(getDropdownOption('ua'), {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });
    expect(getCountrySelectorDropdown()).toBeVisible();
  });

  test('should track escape press', () => {
    const onEscapePress = jest.fn();
    const { rerender } = render(
      <CountrySelectorDropdown show={true} onEscapePress={onEscapePress} />,
    );
    fireEvent.keyDown(getDropdownOption('ua'), {
      key: 'Escape',
      code: 'Escape',
      charCode: 27,
    });
    expect(onEscapePress.mock.calls.length).toBe(1);

    // should not break without passing a callback
    rerender(<CountrySelectorDropdown show={true} />);
    fireEvent.keyDown(getDropdownOption('ua'), {
      key: 'Escape',
      code: 'Escape',
      charCode: 27,
    });
    expect(getCountrySelectorDropdown()).toBeVisible();
  });

  test('use different prefixes', () => {
    const { rerender } = render(
      <CountrySelectorDropdown show={true} dialCodePrefix="test" />,
    );
    expect(getDropdownOption('pl')).toHaveTextContent('test48');
    expect(getDropdownOption('ua')).toHaveTextContent('test380');

    rerender(<CountrySelectorDropdown show={true} dialCodePrefix="" />);
    expect(getDropdownOption('pl')).toHaveTextContent('48');
    expect(getDropdownOption('ua')).toHaveTextContent('380');
  });
});
