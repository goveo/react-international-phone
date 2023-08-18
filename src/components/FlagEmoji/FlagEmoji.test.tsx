import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { FlagEmoji } from './FlagEmoji';

export const getFlagEmoji = () =>
  screen.getByText(
    (content, element) => element?.tagName.toLowerCase() === 'img',
  ) as HTMLImageElement;

describe('FlagEmoji', () => {
  test('render country flag', () => {
    render(<FlagEmoji iso2="ua" />);
    expect(getFlagEmoji()).toBeVisible();
    expect(getFlagEmoji()).toHaveAttribute('data-country', 'ua');
  });

  test('pass empty value', () => {
    render(<FlagEmoji />);
    expect(getFlagEmoji()).toBeVisible();
    expect(getFlagEmoji()).not.toHaveAttribute('data-country');
    expect(getFlagEmoji()).not.toHaveAttribute('src');
  });

  test('should have proper className', () => {
    const { rerender } = render(<FlagEmoji iso2="ua" />);
    expect(getFlagEmoji().className).toBe(
      'react-international-phone-flag-emoji',
    );

    rerender(<FlagEmoji iso2="ua" className="test" />);
    expect(getFlagEmoji().className).toBe(
      'react-international-phone-flag-emoji test',
    );
  });

  test('change flag size', () => {
    const { rerender } = render(<FlagEmoji iso2="ua" size="24px" />);
    expect(getFlagEmoji()).toHaveAttribute('height', '24px');
    expect(getFlagEmoji()).toHaveAttribute('width', '24px');
    expect(getFlagEmoji().style.height).toBe('24px');
    expect(getFlagEmoji().style.width).toBe('24px');

    rerender(<FlagEmoji iso2="ua" size="30px" />);
    expect(getFlagEmoji()).toHaveAttribute('height', '30px');
    expect(getFlagEmoji()).toHaveAttribute('width', '30px');
  });

  test('pass default image props', () => {
    const onClick = jest.fn();
    render(<FlagEmoji iso2="ua" onClick={onClick} />);
    fireEvent.click(getFlagEmoji());
    expect(onClick.mock.calls.length).toBe(1);
  });

  test('pass protocol prop', () => {
    const { rerender } = render(<FlagEmoji iso2="ua" protocol="https" />);
    expect(getFlagEmoji().getAttribute('src')).toMatch(/https:\/\//);

    rerender(<FlagEmoji iso2="ua" protocol="http" />);
    expect(getFlagEmoji().getAttribute('src')).toMatch(/http:\/\//);
  });

  test('should be able to disable lazy-loading using disableLazyLoading prop', () => {
    const { rerender } = render(<FlagEmoji iso2="ua" disableLazyLoading />);
    expect(getFlagEmoji().getAttribute('loading')).toBeNull();

    rerender(<FlagEmoji iso2="ua" />);
    expect(getFlagEmoji().getAttribute('loading')).toBe('lazy');
  });

  test('should use src prop if passed', () => {
    const imageSrc = '/public/ua.svg';

    const { rerender } = render(<FlagEmoji iso2="ua" />);
    expect(getFlagEmoji().getAttribute('src')).not.toBe(imageSrc);

    rerender(<FlagEmoji iso2="ua" src={imageSrc} />);
    expect(getFlagEmoji().getAttribute('src')).toBe(imageSrc);
  });
});
