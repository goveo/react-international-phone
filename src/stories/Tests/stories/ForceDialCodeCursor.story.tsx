import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import React from 'react';

import { PhoneInput } from '../../../index';
import { StorybookTestUtils } from '../storybook-test-utils';
import { TestStory } from '../Tests.stories';

export const ForceDialCodeCursor: TestStory = {
  render: (args) => (
    <PhoneInput forceDialCode placeholder="Phone number" {...args} />
  ),
  play: async ({ canvasElement }) => {
    const utils = new StorybookTestUtils(canvasElement);

    const phoneInput = utils.getPhoneInput();
    // should be prefilled by default
    await expect(phoneInput.value).toBe('+1 ');

    // should handle cursor if type in the end of input
    await userEvent.type(phoneInput, '1');
    await expect(phoneInput.value).toBe('+1 (1');
    await expect(utils.getCursorPosition()).toBe('+1 (1'.length);

    await userEvent.type(phoneInput, '2');
    await expect(phoneInput.value).toBe('+1 (12');
    await expect(utils.getCursorPosition()).toBe('+1 (12'.length);

    await userEvent.type(phoneInput, '3');
    await expect(phoneInput.value).toBe('+1 (123) ');
    await expect(utils.getCursorPosition()).toBe('+1 (123) '.length);

    await userEvent.type(phoneInput, '4');
    await expect(phoneInput.value).toBe('+1 (123) 4');
    await expect(utils.getCursorPosition()).toBe('+1 (123) 4'.length);

    await userEvent.type(phoneInput, '5');
    await expect(phoneInput.value).toBe('+1 (123) 45');
    await expect(utils.getCursorPosition()).toBe('+1 (123) 45'.length);

    await userEvent.type(phoneInput, '6');
    await expect(phoneInput.value).toBe('+1 (123) 456-');
    await expect(utils.getCursorPosition()).toBe('+1 (123) 456-'.length);

    await userEvent.type(phoneInput, '7');
    await expect(phoneInput.value).toBe('+1 (123) 456-7');
    await expect(utils.getCursorPosition()).toBe('+1 (123) 456-7'.length);

    await userEvent.type(phoneInput, '8');
    await expect(phoneInput.value).toBe('+1 (123) 456-78');
    await expect(utils.getCursorPosition()).toBe('+1 (123) 456-78'.length);

    await userEvent.type(phoneInput, '9');
    await expect(phoneInput.value).toBe('+1 (123) 456-789');
    await expect(utils.getCursorPosition()).toBe('+1 (123) 456-789'.length);

    await userEvent.type(phoneInput, '0');
    await expect(phoneInput.value).toBe('+1 (123) 456-7890');
    await expect(utils.getCursorPosition()).toBe('+1 (123) 456-7890'.length);

    await userEvent.type(phoneInput, '4');
    await expect(phoneInput.value).toBe('+1 (123) 456-7890');
    await expect(utils.getCursorPosition()).toBe('+1 (123) 456-7890'.length); // ignore overflow typing

    // should set cursor when press backspace in the end of input
    utils.setCursorPosition('+1 (123) 456-7890'.length);
    await utils.pressBackspace(3);
    await expect(phoneInput.value).toBe('+1 (123) 456-7');
    await expect(utils.getCursorPosition()).toBe('+1 (123) 456-7'.length);
    await utils.pressBackspace();
    await expect(phoneInput.value).toBe('+1 (123) 456');
    await expect(utils.getCursorPosition()).toBe('+1 (123) 456'.length);

    await userEvent.type(phoneInput, '7890');

    // should set cursor when press backspace in the middle of input
    utils.setCursorPosition('+1 (123) 45'.length);
    await expect(phoneInput.value).toBe('+1 (123) 456-7890');
    await expect(utils.getCursorPosition()).toBe('+1 (123) 45'.length);

    await utils.pressBackspace();
    await expect(phoneInput.value).toBe('+1 (123) 467-890');
    await expect(utils.getCursorPosition()).toBe('+1 (123) 4'.length);

    await utils.pressBackspace();
    await expect(phoneInput.value).toBe('+1 (123) 678-90');
    await expect(utils.getCursorPosition()).toBe('+1 (123'.length);

    await utils.pressBackspace();
    await expect(phoneInput.value).toBe('+1 (126) 789-0');
    await expect(utils.getCursorPosition()).toBe('+1 (12'.length);

    await utils.pressBackspace();
    await expect(phoneInput.value).toBe('+1 (167) 890');
    await expect(utils.getCursorPosition()).toBe('+1 (1'.length);

    await utils.pressBackspace();
    await expect(phoneInput.value).toBe('+1 (678) 90');
    await expect(utils.getCursorPosition()).toBe('+1'.length);

    await utils.pressBackspace();
    await expect(phoneInput.value).toBe('+1 (678) 90');
    await expect(utils.getCursorPosition()).toBe('+1 '.length);

    utils.setCursorPosition('+'.length);
    await utils.pressBackspace();
    await expect(phoneInput.value).toBe('+1 (678) 90');
    await expect(utils.getCursorPosition()).toBe('+1 '.length);

    utils.setCursorPosition(0);
    await utils.pressBackspace();
    await expect(phoneInput.value).toBe('+1 (678) 90');
    await expect(utils.getCursorPosition()).toBe(0);

    utils.setCursorSelection(0, phoneInput.value.length);
    await utils.pressBackspace();
    await expect(phoneInput.value).toBe('+1 ');

    // should set cursor when press delete in the middle of input
    await userEvent.type(phoneInput, '(123) 456-7890');
    await expect(phoneInput.value).toBe('+1 (123) 456-7890');
    await expect(utils.getCursorPosition()).toBe('+1 (123) 456-7890'.length);

    utils.setCursorPosition('+1 (123) 45'.length);
    await utils.pressDelete();
    await expect(phoneInput.value).toBe('+1 (123) 457-890');
    await expect(utils.getCursorPosition()).toBe('+1 (123) 45'.length);

    await utils.pressDelete();
    await expect(phoneInput.value).toBe('+1 (123) 458-90');
    await expect(utils.getCursorPosition()).toBe('+1 (123) 45'.length);

    await utils.pressDelete();
    await expect(phoneInput.value).toBe('+1 (123) 459-0');
    await expect(utils.getCursorPosition()).toBe('+1 (123) 45'.length);

    await utils.pressDelete();
    await expect(phoneInput.value).toBe('+1 (123) 450-');
    await expect(utils.getCursorPosition()).toBe('+1 (123) 45'.length);

    await utils.pressDelete();
    await expect(phoneInput.value).toBe('+1 (123) 45');
    await expect(utils.getCursorPosition()).toBe('+1 (123) 45'.length);

    await utils.pressDelete();
    await expect(phoneInput.value).toBe('+1 (123) 45');
    await expect(utils.getCursorPosition()).toBe('+1 (123) 45'.length);

    // should not change dial code if on delete press
    utils.setCursorSelection(0, phoneInput.value.length);
    await utils.pressDelete();
    await expect(phoneInput.value).toBe('+1 ');
    await expect(utils.getCursorPosition()).toBe('+1 '.length);

    await userEvent.type(phoneInput, '(123) 456-7890');

    utils.setCursorSelection(0, '+1 '.length);
    await utils.pressDelete();
    await expect(phoneInput.value).toBe('+1 (123) 456-7890');
    await expect(utils.getCursorPosition()).toBe('+1 '.length);

    utils.setCursorPosition('+'.length);
    await utils.pressDelete();
    await expect(phoneInput.value).toBe('+1 (123) 456-7890');
    await expect(utils.getCursorPosition()).toBe('+1 '.length);

    utils.setCursorPosition('+1'.length);
    await utils.pressDelete();
    await expect(phoneInput.value).toBe('+1 (123) 456-7890');
    await expect(utils.getCursorPosition()).toBe('+1 '.length);

    await utils.pressDelete();
    await expect(phoneInput.value).toBe('+1 (123) 456-7890');
    await expect(utils.getCursorPosition()).toBe('+1 ('.length);

    // should set cursor after dropdown country change
    await utils.selectCountry('cz');
    await expect(utils.getCursorPosition()).toBe('+420 '.length);
  },
};
