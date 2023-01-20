import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { defaultCountries } from '../../data/countryData';
import * as scrollToChildModule from '../../utils/common/scrollToChild';
import {
  getCountryFlag,
  getCountrySelectorDropdown,
  getDropdownOption,
} from '../../utils/test-utils';
import {
  CountrySelectorDropdown,
  CountrySelectorDropdownProps,
} from './CountrySelectorDropdown';

const defaultDropdownProps: CountrySelectorDropdownProps = {
  selectedCountry: 'ua',
  show: true,
};

const activeItemClass =
  'react-international-phone-country-selector-dropdown__list-item--active';
const selectedItemClass =
  'react-international-phone-country-selector-dropdown__list-item--selected';

describe('CountrySelectorDropdown', () => {
  const user = userEvent.setup();

  test('render CountrySelectorDropdown', () => {
    render(<CountrySelectorDropdown {...defaultDropdownProps} />);
    expect(getCountrySelectorDropdown()).toBeVisible();
  });

  test('hide dropdown on show=false', () => {
    render(<CountrySelectorDropdown {...defaultDropdownProps} show={false} />);
    expect(getCountrySelectorDropdown()).not.toBeVisible();
    expect(getCountrySelectorDropdown()).toBeInTheDocument();
  });

  test('render country options', () => {
    render(<CountrySelectorDropdown {...defaultDropdownProps} />);
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
    render(<CountrySelectorDropdown {...defaultDropdownProps} />);
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
      <CountrySelectorDropdown {...defaultDropdownProps} onSelect={onSelect} />,
    );
    fireEvent.click(getDropdownOption('ua'));
    expect(onSelect.mock.calls.length).toBe(1);
    expect(onSelect.mock.calls[0][0]).toMatchObject({ name: 'Ukraine' });

    // should not break without passing a callback
    rerender(<CountrySelectorDropdown {...defaultDropdownProps} />);
    fireEvent.click(getDropdownOption('ua'));
    expect(getCountrySelectorDropdown()).toBeVisible();
  });

  test('should select country on enter press', () => {
    const onSelect = jest.fn();
    const { rerender } = render(
      <CountrySelectorDropdown {...defaultDropdownProps} onSelect={onSelect} />,
    );
    fireEvent.keyDown(getDropdownOption('ua'), {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });
    expect(onSelect.mock.calls.length).toBe(1);
    expect(onSelect.mock.calls[0][0]).toMatchObject({ name: 'Ukraine' });

    // should not break without passing a callback
    rerender(<CountrySelectorDropdown {...defaultDropdownProps} />);
    fireEvent.keyDown(getDropdownOption('ua'), {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });
    expect(getCountrySelectorDropdown()).toBeVisible();
  });

  test('should track escape press', () => {
    const onClose = jest.fn();
    const { rerender } = render(
      <CountrySelectorDropdown {...defaultDropdownProps} onClose={onClose} />,
    );
    fireEvent.keyDown(getDropdownOption('ua'), {
      key: 'Escape',
      code: 'Escape',
      charCode: 27,
    });
    expect(onClose.mock.calls.length).toBe(1);

    // should not break without passing a callback
    rerender(<CountrySelectorDropdown {...defaultDropdownProps} />);
    fireEvent.keyDown(getDropdownOption('ua'), {
      key: 'Escape',
      code: 'Escape',
      charCode: 27,
    });
    expect(getCountrySelectorDropdown()).toBeVisible();
  });

  test('use different prefixes', () => {
    const { rerender } = render(
      <CountrySelectorDropdown
        {...defaultDropdownProps}
        dialCodePrefix="test"
      />,
    );
    expect(getDropdownOption('pl')).toHaveTextContent('test48');
    expect(getDropdownOption('ua')).toHaveTextContent('test380');

    rerender(
      <CountrySelectorDropdown {...defaultDropdownProps} dialCodePrefix="" />,
    );
    expect(getDropdownOption('pl')).toHaveTextContent('48');
    expect(getDropdownOption('ua')).toHaveTextContent('380');
  });

  describe('scroll to selected country', () => {
    const scrollToChildSpy = jest.spyOn(scrollToChildModule, 'scrollToChild');
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should scroll to selected country on initial render', () => {
      render(
        <CountrySelectorDropdown
          {...defaultDropdownProps}
          selectedCountry="ua"
        />,
      );
      expect(scrollToChildSpy).toBeCalledTimes(1);
    });

    test('should scroll to selected country on country change', () => {
      const { rerender } = render(
        <CountrySelectorDropdown
          {...defaultDropdownProps}
          selectedCountry="ua"
        />,
      );
      expect(scrollToChildSpy).toBeCalledTimes(1);

      rerender(
        <CountrySelectorDropdown
          {...defaultDropdownProps}
          selectedCountry="us"
        />,
      );
      expect(scrollToChildSpy).toBeCalledTimes(2);

      rerender(<CountrySelectorDropdown show={false} selectedCountry="us" />);
      rerender(
        <CountrySelectorDropdown
          {...defaultDropdownProps}
          selectedCountry="us"
        />,
      );
      expect(scrollToChildSpy).toBeCalledTimes(2);
    });

    test('should scroll to selected country by keyboard', async () => {
      render(
        <CountrySelectorDropdown
          {...defaultDropdownProps}
          selectedCountry="ua"
        />,
      );
      expect(scrollToChildSpy).toBeCalledTimes(1);
      await user.keyboard('{arrowup>10}');
      expect(scrollToChildSpy).toBeCalledTimes(11);
    });
  });

  describe('accessibility', () => {
    test('should select country by keyboard arrows', async () => {
      const onSelect = jest.fn();

      render(
        <CountrySelectorDropdown
          {...defaultDropdownProps}
          selectedCountry="us"
          onSelect={onSelect}
        />,
      );
      expect(getCountrySelectorDropdown()).toBeVisible();

      expect(getDropdownOption('us')).toHaveClass(activeItemClass);
      expect(getDropdownOption('us')).toHaveClass(selectedItemClass);

      expect(getDropdownOption('ua')).not.toHaveClass(activeItemClass);
      expect(getDropdownOption('ua')).not.toHaveClass(selectedItemClass);

      await user.keyboard('{arrowup}{arrowup}{arrowup}');

      expect(getDropdownOption('us')).toHaveClass(selectedItemClass);
      expect(getDropdownOption('us')).not.toHaveClass(activeItemClass);

      expect(getDropdownOption('ua')).toHaveClass(activeItemClass);
      expect(getDropdownOption('ua')).not.toHaveClass(selectedItemClass);

      await user.keyboard('{enter}');

      expect(onSelect.mock.calls.length).toBe(1);
      expect(onSelect.mock.calls[0][0]).toMatchObject({ name: 'Ukraine' });
    });

    test('should move active item on pageUp and pageDown', async () => {
      render(
        <CountrySelectorDropdown
          {...defaultDropdownProps}
          selectedCountry="us"
        />,
      );
      expect(getCountrySelectorDropdown()).toBeVisible();
      expect(getDropdownOption('us')).toHaveClass(activeItemClass);
      expect(getDropdownOption('af')).not.toHaveClass(activeItemClass);
      expect(getDropdownOption('zw')).not.toHaveClass(activeItemClass);

      await user.keyboard('{pageup}');
      expect(getDropdownOption('us')).not.toHaveClass(activeItemClass);
      expect(getDropdownOption('af')).toHaveClass(activeItemClass);
      expect(getDropdownOption('zw')).not.toHaveClass(activeItemClass);

      await user.keyboard('{pagedown}');
      expect(getDropdownOption('us')).not.toHaveClass(activeItemClass);
      expect(getDropdownOption('af')).not.toHaveClass(activeItemClass);
      expect(getDropdownOption('zw')).toHaveClass(activeItemClass);
    });

    test('should scroll to active item', async () => {
      render(
        <CountrySelectorDropdown
          {...defaultDropdownProps}
          selectedCountry="us"
        />,
      );
      await user.keyboard('{arrowup>19}');

      expect(getDropdownOption('se')).toHaveClass(activeItemClass);
      expect(getDropdownOption('se')).not.toHaveClass(selectedItemClass);
      expect(getDropdownOption('se')).toBeVisible();
    });

    test('should close dropdown on blur', async () => {
      const onClose = jest.fn();

      render(
        <CountrySelectorDropdown
          {...defaultDropdownProps}
          selectedCountry="us"
          onClose={onClose}
        />,
      );
      await userEvent.tab();
      await userEvent.keyboard('{enter}');

      expect(getCountrySelectorDropdown()).toBeVisible();
      await userEvent.tab();

      expect(onClose).toBeCalledTimes(1);
    });
  });
});
