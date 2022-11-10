# DialCodePreview API

**DialCodePreview** is component for preview selected country dial code.

## Usage Example

Import component

```tsx
export { DialCodePreview } from 'react-international-phone';
```

Use by providing the _dialCode_ and _prefix_ properties.

```tsx
<DialCodePreview dialCode="1" prefix="+" />
```

Output:

import BrowserOnly from '@docusaurus/BrowserOnly';

<BrowserOnly fallback={<div>Loading...</div>}>
{() => {
const { DialCodePreview } = require('react-international-phone');
return (
<DialCodePreview dialCode="1" prefix="+" style={{ width: "40px", height: "36px" }} />
);
}}
</BrowserOnly>

### Properties

| Prop                  | Type      | Description              | Default value |
| --------------------- | --------- | ------------------------ | ------------- |
| dialCode `(required)` | `string`  | Country dial code (iso2) |               |
| prefix `(required)`   | `string`  | Dial code prefix         |               |
| disabled              | `boolean` | Is component disabled    | `undefined`   |

### Style properties (`DialCodePreviewStyleProps` type)

| Prop      | Type            | Description                                        |
| --------- | --------------- | -------------------------------------------------- |
| style     | `CSSProperties` | Custom styles for **DialCodePreview container**    |
| className | `string`        | Custom className for **DialCodePreview container** |

### CSS variables

| Variable                                                                | Default value                                         |
| ----------------------------------------------------------------------- | ----------------------------------------------------- |
| --react-international-phone-dial-code-preview-background-color          | --react-international-phone-background-color          |
| --react-international-phone-dial-code-preview-border-color              | --react-international-phone-border-color              |
| --react-international-phone-dial-code-preview-text-color                | --react-international-phone-text-color                |
| --react-international-phone-dial-code-preview-font-size                 | --react-international-phone-font-size                 |
| --react-international-phone-dial-code-preview-disabled-background-color | --react-international-phone-disabled-background-color |
| --react-international-phone-dial-code-preview-disabled-text-color       | --react-international-phone-disabled-text-color       |
