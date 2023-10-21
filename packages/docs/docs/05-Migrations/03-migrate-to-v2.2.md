# Migrating from v2.1 to v2.2

Validation logic has been changed since v2.2.
`areaCodeMatch` and `formatMatch` have now become additional return properties and are not required to mark the phone as valid.

You can additionally check `areaCodeMatch` and `formatMatch` to revert validation logic to how it was working before v2.2 release:

```ts
const phoneValidation = usePhoneValidation('+1 (123) 456-7890');
const isPhoneValid =
  phoneValidation.isValid &&
  phoneValidation.areaCodeMatch &&
  phoneValidation.formatMatch;
```

Check the [Phone Validation page](/docs/Usage/PhoneValidation) to get more info about new validation behavior.
