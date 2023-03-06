# Migration

## From version 1.x.x to 2.0.0

### 2.0 breaking changes

#### `hideSpaceAfterDialCode` prop was changed with `charAfterDialCode`

You should simply remove `hideSpaceAfterDialCode` and add the `charAfterDialCode` prop with the corresponding value, for example:

```jsx
/* before */
<PhoneInput hideSpaceAfterDialCode={true} />

/* after */
<PhoneInput charAfterDialCode="" />
```

#### Removed `usePhone` hook

`usePhone` was removed and now it is not exported from the package entry point.

If you used it, please change it to `usePhoneInput`, it should work the same.

#### Removed `onCountryChange` callback

Please remove it, or use the `useEffect` hook to handle country change:

```jsx
const { country } = usePhoneInput({
  initialCountry: 'us',
  value,
});

useEffect(() => {
  // move your country change logic here
}, [country]);
```
