import RequiredMark from '@site/src/components/RequiredMark'

# FlagEmoji API

**FlagEmoji** is component for rendering country flag.
It's used in [`CountrySelector`](./01-CountrySelector.md) and [`CountrySelectorDropdown`](./02-CountrySelectorDropdown.md) components.

## Usage Example

Import component

```tsx
import { FlagEmoji } from 'react-international-phone';
```

Use by providing the _dialCode_ and _prefix_ properties.

```tsx
<FlagEmoji iso2="ua" size="30px" />
```

Output:

import { FlagEmoji } from 'react-international-phone';

<FlagEmoji iso2="ua" size="30px" />

### Properties

| Prop                 | Type                           | Description                                                                | Default value |
| -------------------- | ------------------------------ | -------------------------------------------------------------------------- | ------------- |
| iso2 <RequiredMark/> | `string`                       | iso2 code of country flag                                                  |               |
| src                  | `string`                       | Custom src of flag                                                         | `undefined`   |
| protocol             | <code>"http" \| "https"</code> | Protocol to use with twemoji cnd                                           | `"https"`     |
| disableLazyLoading   | `boolean`                      | Disable lazy loading of flags (`loading="lazy"` attribute will not be set) | `undefined`   |

### Style properties

| Prop      | Type                     | Description                         |
| --------- | ------------------------ | ----------------------------------- |
| size      | `CSSProperties['width']` | Size of flag (set width and height) |
| style     | `CSSProperties`          | Custom styles prop                  |
| className | `string`                 | Custom className prop               |

### CSS variables

| Variable                                | Default value |
| --------------------------------------- | ------------- |
| --react-international-phone-flag-width  | 24px          |
| --react-international-phone-flag-height | 24px          |
