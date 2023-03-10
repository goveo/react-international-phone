# Migrating from v1 to v2

:::caution Why is it important to update?

Version 1 becomes deprecated and unsupported since v2 is released. <br/>
New features and bug fixes will be pushed only to v2.

:::

This document describes all breaking changes and provides a migration guide from version 1 to version 2.

## `initialCountry` has been renamed to `defaultCountry`

You should rename `initialCountry` prop to `defaultCountry` in your codebase:

```jsx
/* before */
<PhoneInput initialCountry="us" />

/* after */
<PhoneInput defaultCountry="us" />
```

## `hideSpaceAfterDialCode` has been changed with `charAfterDialCode`

You should remove `hideSpaceAfterDialCode` and add the `charAfterDialCode` prop with the corresponding value, for example:

```jsx
/* before */
<PhoneInput hideSpaceAfterDialCode={true} />

/* after */
<PhoneInput charAfterDialCode="" />
```

## `usePhone` hook has been removed

`usePhone` was removed and now it is not exported from the package entry point.

If you used it for some reason, please change it to `usePhoneInput`, it should work the same.

## `onCountryChange` callback has been removed

Please remove it, or use the `useEffect` hook to handle country change:

```jsx
const { country } = usePhoneInput({
  defaultCountry: 'us',
  value,
});

useEffect(() => {
  // move your country change logic here
}, [country]);
```
