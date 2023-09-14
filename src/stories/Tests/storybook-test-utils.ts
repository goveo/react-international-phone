import { queries, within } from '@storybook/testing-library';
import { userEvent } from '@storybook/testing-library';

import { CountryIso2, getCountry } from '../../index';

export class StorybookTestUtils {
  canvas: ReturnType<typeof within<typeof queries>>;

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement);
  }

  getPhoneInput = () => {
    const phoneInput: HTMLInputElement = this.canvas.getByText('', {
      selector: 'input',
    });

    return phoneInput;
  };

  getByPlaceholder = (placeholder: string) => {
    return this.canvas.getByPlaceholderText(placeholder);
  };

  getCountrySelector = () => {
    return this.canvas.getByRole('combobox');
  };

  getCountryDropdownOption = (country: CountryIso2) => {
    const fullCountry = getCountry({ field: 'iso2', value: country });
    return this.canvas.getByLabelText(
      `${fullCountry?.name} +${fullCountry?.dialCode}`,
    );
  };

  selectCountry = (country: CountryIso2) => {
    const countrySelector = this.getCountrySelector();
    countrySelector.click();

    const option = this.getCountryDropdownOption(country);
    option.click();
  };

  getCursorSelection = () => {
    const phoneInput = this.getPhoneInput();
    const start = phoneInput.selectionStart;
    const end = phoneInput.selectionEnd;

    return {
      start,
      end,
    };
  };

  getCursorPosition = () => {
    const { start, end } = this.getCursorSelection();
    return start === end ? start : undefined;
  };

  setCursorSelection = (start: number, end: number) => {
    const phoneInput = this.getPhoneInput();
    phoneInput.selectionStart = start;
    phoneInput.selectionEnd = end;
  };

  setCursorPosition = (cursorPosition: number) => {
    const phoneInput = this.getPhoneInput();
    phoneInput.selectionStart = cursorPosition;
    phoneInput.selectionEnd = cursorPosition;
  };

  pressBackspace = async (times = 1) => {
    return userEvent.keyboard(`{Backspace>${times}/}`);
  };
}
