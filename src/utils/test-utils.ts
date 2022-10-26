import { screen } from '@testing-library/react';

import { CountryIso2 } from '../types';

export const getSystemTimerIncreaseFunc = () => {
  const currentDate = new Date();
  let ms = 0;
  jest.useFakeTimers().setSystemTime(currentDate.setMilliseconds(ms));
  return (msStep = 1000) => {
    ms += msStep;
    jest.useFakeTimers().setSystemTime(currentDate.setMilliseconds(ms));
  };
};

export const getInput = () =>
  screen.getByText(
    (content, element) => element?.tagName.toLowerCase() === 'input',
  ) as HTMLInputElement;

export const getCountrySelector = () =>
  screen.getByText((content, element) => {
    return element?.tagName.toLowerCase() === 'button';
  });

export const getCountrySelectorDropdown = () =>
  screen.getByText((content, element) => {
    return element?.tagName.toLowerCase() === 'ul';
  }) as HTMLUListElement;

export const getDropdownOption = (country: CountryIso2) =>
  screen.getByText((content, element) => {
    return (
      element?.tagName.toLowerCase() === 'li' &&
      element.getAttribute('data-country') === country
    );
  }) as HTMLLIElement;

export const getCountrySelectorFlag = () =>
  screen.getByText((content, element) => {
    return (
      element?.tagName.toLowerCase() === 'img' &&
      element?.parentElement?.tagName.toLowerCase() === 'button'
    );
  }) as HTMLLIElement;

export const getDropdownArrow = () => {
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

export const getDialCodePreview = () => {
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

export const getCountryFlag = (country: CountryIso2) =>
  screen.getByText((content, element) => {
    return (
      element?.tagName.toLowerCase() === 'img' &&
      element.getAttribute('data-country') === country
    );
  }) as HTMLLIElement;
