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

  test('change flag size', () => {
    const { rerender } = render(<FlagEmoji iso2="ua" />);
    expect(getFlagEmoji()).toHaveAttribute('height', '24px');
    expect(getFlagEmoji()).toHaveAttribute('width', '24px');

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
});
