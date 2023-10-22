import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import React from 'react';

import { PhoneInput } from '../../../index';
import { StorybookTestUtils } from '../storybook-test-utils';
import { TestStory } from '../Tests.stories';

export const DisableDialCodeAndPrefix: TestStory = {
  render: (args) => (
    <PhoneInput disableDialCodeAndPrefix placeholder="Phone number" {...args} />
  ),
  play: async ({ canvasElement }) => {
    const utils = new StorybookTestUtils(canvasElement);

    const phoneInput = utils.getPhoneInput();
    await expect(phoneInput.value).toBe('');

    await userEvent.type(phoneInput, '1234');
    await expect(phoneInput.value).toBe('(123) 4');

    await userEvent.type(phoneInput, '567');
    await expect(phoneInput.value).toBe('(123) 456-7');

    await userEvent.type(phoneInput, '890');
    await expect(phoneInput.value).toBe('(123) 456-7890');

    await userEvent.type(phoneInput, '1'); // don't allow overflow
    await expect(phoneInput.value).toBe('(123) 456-7890');

    utils.selectAll();
    await userEvent.keyboard('2');
    await expect(phoneInput.value).toBe('(2');

    // should change country on E.164 format paste
    await expect(utils.getSelectedCountry()).toBe('us');
    utils.selectAll();
    await userEvent.paste('+38097');
    await expect(phoneInput.value).toBe('(97) ');
    await expect(utils.getSelectedCountry()).toBe('ua');

    utils.selectAll();
    await userEvent.paste('1 (234) 567-8900');
    await expect(phoneInput.value).toBe('(12) 345 67 89');
    await expect(utils.getSelectedCountry()).toBe('ua');
  },
};
