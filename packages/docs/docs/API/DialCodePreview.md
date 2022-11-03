---
sidebar_position: 4
---

# DialCodePreview component

### Properties

| Prop                  | Type      | Description              | Default value |
| --------------------- | --------- | ------------------------ | ------------- |
| dialCode `(required)` | `string`  | Country dial code (iso2) |               |
| prefix `(required)`   | `string`  | Dial code prefix         |               |
| disabled              | `boolean` | Is component disabled    | `undefined`   |

### Style properties (DialCodePreviewStyleProps type)

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
