# Migration

## From version 1.x.x to 2.0.0

### `initialCountry` has been renamed to `defaultCountry`

You should rename `initialCountry` prop to `defaultCountry` in your codebase:

```jsx
/* before */
<PhoneInput initialCountry="us" />

/* after */
<PhoneInput defaultCountry="us" />
```

### `hideSpaceAfterDialCode` has been changed with `charAfterDialCode`

You should remove `hideSpaceAfterDialCode` and add the `charAfterDialCode` prop with the corresponding value, for example:

```jsx
/* before */
<PhoneInput hideSpaceAfterDialCode={true} />

/* after */
<PhoneInput charAfterDialCode="" />
```

### `usePhone` hook has been removed

`usePhone` was removed and now it is not exported from the package entry point.

If you used it for some reason, please change it to `usePhoneInput`, it should work the same.

### `onCountryChange` callback has been removed

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
