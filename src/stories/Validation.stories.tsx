import { PhoneNumberUtil } from 'google-libphonenumber';
const phoneUtil = PhoneNumberUtil.getInstance();

const validatePhone = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { PhoneInput } from '../index';

const ValidationResult: React.FC<{
  isValid: boolean;
}> = ({ isValid }) => {
  return (
    <code style={{ color: isValid === false ? 'red' : 'green' }}>
      isValid: {String(isValid)}
    </code>
  );
};

export const Default = () => {
  const [phone, setPhone] = useState('');
  const isValid = validatePhone(phone);

  return (
    <div>
      <p>phone: {phone}</p>
      <PhoneInput
        defaultCountry="ua"
        value={phone}
        onChange={(phone) => {
          setPhone(phone);
        }}
        name="phone"
      />
      <ValidationResult isValid={isValid} />
    </div>
  );
};

export const Prefilled = () => {
  const [phone, setPhone] = useState('+12049999999');
  const isValid = validatePhone(phone);

  return (
    <div>
      <p>phone: {phone}</p>
      <PhoneInput
        defaultCountry="ua"
        value={phone}
        onChange={(phone) => {
          setPhone(phone);
        }}
        name="phone"
      />
      <ValidationResult isValid={isValid} />
    </div>
  );
};

export const ReactHookForm = () => {
  const {
    control,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: { phone: '+1201' },
    mode: 'onChange',
  });

  // Optional: validate on mount
  useEffect(() => {
    trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <div>
            <p>phone: {field.value}</p>
            <PhoneInput
              defaultCountry="us"
              value={field.value}
              onChange={field.onChange}
              name={field.name}
              onBlur={field.onBlur}
            />
          </div>
        )}
        rules={{
          validate: (phone) => validatePhone(phone),
        }}
      />
      <ValidationResult isValid={!errors.phone} />
    </div>
  );
};

export const Formik = () => {
  const { values, errors, setFieldTouched, setFieldValue } = useFormik({
    initialValues: {
      phone: '+1204',
    },
    onSubmit: () => undefined,
    validateOnChange: true,
    validateOnMount: true,
    validate: ({ phone }) => {
      const errors: Record<string, string> = {};

      const isValid = validatePhone(phone);
      if (!isValid) {
        errors.phone = 'Phone is not valid';
      }

      return errors;
    },
  });

  return (
    <div>
      <p>phone: {values.phone}</p>
      <PhoneInput
        defaultCountry="us"
        value={values.phone}
        onChange={(newPhone) => {
          setFieldTouched('phone');
          setFieldValue('phone', newPhone);
        }}
        name="phone"
      />
      <ValidationResult isValid={!errors.phone} />
    </div>
  );
};

const formValidationSchema = Yup.object().shape({
  phone: Yup.string()
    .required('Required')
    .test('phone', 'Phone number is invalid', (value) =>
      validatePhone(value ?? ''),
    ),
});

export const FormikWithYup = () => {
  const { values, errors, setFieldTouched, setFieldValue } = useFormik({
    initialValues: {
      phone: '+1205',
    },
    onSubmit: () => undefined,
    validateOnChange: true,
    validateOnMount: true,
    validationSchema: formValidationSchema,
  });

  return (
    <div>
      <p>phone: {values.phone}</p>
      <PhoneInput
        defaultCountry="us"
        value={values.phone}
        onChange={(newPhone) => {
          setFieldTouched('phone');
          setFieldValue('phone', newPhone);
        }}
        name="phone"
      />
      <ValidationResult isValid={!errors.phone} />
    </div>
  );
};

export default {
  title: 'Validation',
};
