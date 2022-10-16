import { render, screen } from '@testing-library/react';
import React from 'react';

import { PhoneInput } from './PhoneInput';

const getInput = () =>
  screen.getByText(
    (content, element) => element?.tagName.toLowerCase() === 'input',
  );

const getCountrySelector = () =>
  screen.getByText((content, element) => {
    return element?.tagName.toLowerCase() === 'button';
  });

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
});
