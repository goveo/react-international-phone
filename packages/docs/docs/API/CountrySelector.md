---
sidebar_position: 2
---

# CountrySelector

### Properties

| Prop            | Type          | Description                                               | Default value |
| --------------- | ------------- | --------------------------------------------------------- | ------------- |
| selectedCountry | `CountryIso2` | Selected country (iso2)                                   | `undefined`   |
| disabled        | `boolean`     | Is CountrySelector disabled                               | `undefined`   |
| hideDropdown    | `boolean`     | Hide dropdown icon and make CountrySelector not clickable | `undefined`   |

### Events

| Prop     | Type                               | Description                           |
| -------- | ---------------------------------- | ------------------------------------- |
| onSelect | `(country: ParsedCountry) => void` | Callback that calls on country select |

### Style properties (CountrySelectorStyleProps type)

| Prop                   | Type                                                                      | Description                                             |
| ---------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------- |
| style                  | `CSSProperties`                                                           | Custom styles for **CountrySelector container**         |
| className              | `string`                                                                  | Custom className for **CountrySelector container**      |
| buttonStyle            | `CSSProperties`                                                           | Custom styles for **CountrySelector button**            |
| buttonClassName        | `string`                                                                  | Custom className for **CountrySelector button**         |
| flagStyle              | `dropdownStyleProps`                                                      | Custom styles for **CountrySelector flag**              |
| flagClassName          | `string`                                                                  | Custom className for **CountrySelector flag**           |
| dropdownArrowStyle     | `dropdownStyleProps`                                                      | Custom styles for **CountrySelector dropdown arrow**    |
| dropdownArrowClassName | `string`                                                                  | Custom className for **CountrySelector dropdown arrow** |
| dropdownStyleProps     | [`CountrySelectorDropdownStyleProps`](#CountrySelectorDropdownStyleProps) | Style properties for **CountrySelector dropdown**       |

### CSS variables

| Variable                                                               | Default value                                         |
| ---------------------------------------------------------------------- | ----------------------------------------------------- |
| --react-international-phone-country-selector-background-color          | --react-international-phone-background-color          |
| --react-international-phone-country-selector-background-color-hover    | `whitesmoke`                                          |
| --react-international-phone-disabled-country-selector-background-color | --react-international-phone-disabled-background-color |
| --react-international-phone-country-selector-border-color              | `13px`                                                |
| --react-international-phone-country-selector-arrow-size                | `4px`                                                 |
| --react-international-phone-country-selector-arrow-color               | `#777`                                                |
| --react-international-phone-disabled-country-selector-arrow-color      | `#999`                                                |
