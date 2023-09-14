import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import React from 'react';

import { PhoneInput } from '../../../index';
import { StorybookTestUtils } from '../storybook-test-utils';
import { TestStory } from '../Tests.stories';

export const Default: TestStory = {
  render: (args) => <PhoneInput placeholder="Phone number" {...args} />,
  play: async ({ canvasElement }) => {
    const utils = new StorybookTestUtils(canvasElement);

    const phoneInput = utils.getPhoneInput();
    // should be prefilled by default
    await expect(phoneInput.value).toBe('+1 ');

    await userEvent.type(phoneInput, '1234567890', { delay: 100 });
    await expect(phoneInput.value).toBe('+1 (123) 456-7890');

    await userEvent.clear(phoneInput);
    // should not prefill after clear
    await expect(phoneInput.value).toBe('');
    // should render placeholder
    await expect(utils.getByPlaceholder('Phone number')).toBe(phoneInput);

    // should change country
    await userEvent.type(phoneInput, '38099', { delay: 100 });
    await expect(phoneInput.value).toBe('+380 (99) ');

    await utils.selectCountry('ca');
    await expect(phoneInput.value).toBe('+1 ');
  },
};
