import type { Meta, StoryObj } from '@storybook/react';

import { PhoneInput } from '../../index';

const meta: Meta<typeof PhoneInput> = {
  title: 'Tests',
  component: PhoneInput,
};

export default meta;
export type TestStory = StoryObj<typeof PhoneInput>;

/* eslint-disable simple-import-sort/imports */
import { Default } from './stories/Default.story';
import { ForceDialCode } from './stories/ForceDialCode.story';
import { ForceDialCodeCursor } from './stories/ForceDialCodeCursor.story';

export const _Default = Default;
export const _ForceDialCode = ForceDialCode;
export const _ForceDialCodeCursor = ForceDialCodeCursor;
