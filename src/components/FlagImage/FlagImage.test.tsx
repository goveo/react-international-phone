import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { FlagImage } from './FlagImage';

export const getFlagImage = () =>
  screen.getByText(
    (content, element) => element?.tagName.toLowerCase() === 'img',
  ) as HTMLImageElement;

describe('FlagImage', () => {
  test('render country flag', () => {
    render(<FlagImage iso2="ua" />);
    expect(getFlagImage()).toBeVisible();
    expect(getFlagImage()).toHaveAttribute('data-country', 'ua');
  });

  test('pass empty value', () => {
    render(<FlagImage />);
    expect(getFlagImage()).toBeVisible();
    expect(getFlagImage()).not.toHaveAttribute('data-country');
    expect(getFlagImage()).not.toHaveAttribute('src');
  });

  test('should have proper className', () => {
    const { rerender } = render(<FlagImage iso2="ua" />);
    expect(getFlagImage().className).toBe(
      'react-international-phone-flag-emoji',
    );

    rerender(<FlagImage iso2="ua" className="test" />);
    expect(getFlagImage().className).toBe(
      'react-international-phone-flag-emoji test',
    );
  });

  test('change flag size', () => {
    const { rerender } = render(<FlagImage iso2="ua" size="24px" />);
    expect(getFlagImage()).toHaveAttribute('height', '24px');
    expect(getFlagImage()).toHaveAttribute('width', '24px');
    expect(getFlagImage().style.height).toBe('24px');
    expect(getFlagImage().style.width).toBe('24px');

    rerender(<FlagImage iso2="ua" size="30px" />);
    expect(getFlagImage()).toHaveAttribute('height', '30px');
    expect(getFlagImage()).toHaveAttribute('width', '30px');
  });

  test('pass default image props', () => {
    const onClick = jest.fn();
    render(<FlagImage iso2="ua" onClick={onClick} />);
    fireEvent.click(getFlagImage());
    expect(onClick.mock.calls.length).toBe(1);
  });

  test('pass protocol prop', () => {
    const { rerender } = render(<FlagImage iso2="ua" protocol="https" />);
    expect(getFlagImage().getAttribute('src')).toMatch(/https:\/\//);

    rerender(<FlagImage iso2="ua" protocol="http" />);
    expect(getFlagImage().getAttribute('src')).toMatch(/http:\/\//);
  });

  test('should be able to disable lazy-loading using disableLazyLoading prop', () => {
    const { rerender } = render(<FlagImage iso2="ua" disableLazyLoading />);
    expect(getFlagImage().getAttribute('loading')).toBeNull();

    rerender(<FlagImage iso2="ua" />);
    expect(getFlagImage().getAttribute('loading')).toBe('lazy');
  });

  test('should use src prop if passed', () => {
    const imageSrc = '/public/ua.svg';

    const { rerender } = render(<FlagImage iso2="ua" />);
    expect(getFlagImage().getAttribute('src')).not.toBe(imageSrc);

    rerender(<FlagImage iso2="ua" src={imageSrc} />);
    expect(getFlagImage().getAttribute('src')).toBe(imageSrc);
  });
});
