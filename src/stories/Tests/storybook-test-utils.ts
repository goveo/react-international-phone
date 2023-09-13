import { within } from '@storybook/testing-library';
import { queries } from '@testing-library/dom';

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
}
