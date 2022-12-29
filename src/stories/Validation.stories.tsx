import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { PhoneInput, usePhoneValidation, validatePhone } from '../index';

const ValidationProperty: React.FC<{
  title: string;
  value: unknown;
}> = ({ title, value }) => {
  return (
    <code style={{ color: value === false ? 'red' : 'green' }}>
      <p>
        {title}: {String(value)}
      </p>
    </code>
  );
};

export const Default = () => {
  const [phone, setPhone] = useState('');
  const validation = usePhoneValidation(phone);

  return (
    <div>
      <PhoneInput
        initialCountry="ua"
        value={phone}
        onChange={(phone) => setPhone(phone)}
      />
      <ValidationProperty title="isValid" value={validation.isValid} />
      <ValidationProperty title="lengthMatch" value={validation.lengthMatch} />
      <ValidationProperty
        title="areaCodeMatch"
        value={validation.areaCodeMatch}
      />
      <ValidationProperty title="country" value={validation.country?.iso2} />
    </div>
  );
};

export const ReactHookForm = () => {
  const {
    control,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: { phone: '+1 (201)' },
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
          <PhoneInput
            initialCountry="us"
            value={field.value}
            onChange={field.onChange}
            inputProps={{
              name: field.name,
              onBlur: field.onBlur,
            }}
          />
        )}
        rules={{
          validate: (phone) => validatePhone(phone).isValid,
        }}
      />
      <ValidationProperty title="isValid" value={!errors.phone} />
    </div>
  );
};

export const Formik = () => {
  const { values, errors, setFieldTouched, setFieldValue } = useFormik({
    initialValues: {
      phone: '+1 (204)',
    },
    onSubmit: () => undefined,
    validateOnChange: true,
    validateOnMount: true,
    validate: ({ phone }) => {
      const errors: Record<string, string> = {};

      const validationResult = validatePhone(phone);
      if (!validationResult.isValid) {
        errors.phone = 'something went wrong';
      }
      if (!validationResult.lengthMatch) {
        errors.phone = 'wrong phone length';
      }
      if (!validationResult.areaCodeMatch) {
        errors.phone = 'wrong area code';
      }
      if (!validationResult.country) {
        errors.phone = 'wrong dial code';
      }

      return errors;
    },
  });

  return (
    <div>
      <PhoneInput
        initialCountry="us"
        value={values.phone}
        onChange={(newPhone) => {
          setFieldTouched('phone');
          setFieldValue('phone', newPhone);
        }}
        inputProps={{
          name: 'phone',
        }}
      />
      <code style={{ color: errors.phone ? 'red' : 'green' }}>
        <p>{errors.phone ? `Error: ${errors.phone}` : 'Phone is valid'}</p>
      </code>
    </div>
  );
};

const formValidationSchema = Yup.object().shape({
  phone: Yup.string()
    .required('Required')
    .test(
      'phone',
      'Phone number is invalid',
      (value) => validatePhone(value ?? '').isValid,
    ),
});

export const FormikWithYup = () => {
  const { values, errors, setFieldTouched, setFieldValue } = useFormik({
    initialValues: {
      phone: '+1 (204)',
    },
    onSubmit: () => undefined,
    validateOnChange: true,
    validateOnMount: true,
    validationSchema: formValidationSchema,
  });

  return (
    <div>
      <PhoneInput
        initialCountry="us"
        value={values.phone}
        onChange={(newPhone) => {
          setFieldTouched('phone');
          setFieldValue('phone', newPhone);
        }}
        inputProps={{
          name: 'phone',
        }}
      />
      <code style={{ color: errors.phone ? 'red' : 'green' }}>
        <p>{errors.phone ? `Error: ${errors.phone}` : 'Phone is valid'}</p>
      </code>
    </div>
  );
};

export default {
  title: 'Validation',
};
