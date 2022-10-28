import { render } from '@testing-library/react';
import React from 'react';

import { getDialCodePreview } from '../../utils/test-utils';
import { DialCodePreview } from './DialCodePreview';

describe('DialCodePreview', () => {
  test('render component', () => {
    render(<DialCodePreview prefix="+" dialCode="380" />);
    expect(getDialCodePreview()).toBeVisible();
    expect(getDialCodePreview()?.textContent).toBe('+380');
  });

  test('should support different prefixes', () => {
    const { rerender } = render(<DialCodePreview prefix="+" dialCode="380" />);
    expect(getDialCodePreview()?.textContent).toBe('+380');

    rerender(<DialCodePreview prefix="-" dialCode="380" />);
    expect(getDialCodePreview()?.textContent).toBe('-380');

    rerender(<DialCodePreview prefix="" dialCode="380" />);
    expect(getDialCodePreview()?.textContent).toBe('380');
  });

  test('should support different dial codes', () => {
    const { rerender } = render(<DialCodePreview prefix="+" dialCode="1" />);
    expect(getDialCodePreview()?.textContent).toBe('+1');

    rerender(<DialCodePreview prefix="+" dialCode="23" />);
    expect(getDialCodePreview()?.textContent).toBe('+23');

    rerender(<DialCodePreview prefix="+" dialCode="123" />);
    expect(getDialCodePreview()?.textContent).toBe('+123');

    rerender(<DialCodePreview prefix="" dialCode="99" />);
    expect(getDialCodePreview()?.textContent).toBe('99');
  });
});
