import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import {
  CountryIso2,
  PhoneInput,
  usePhoneValidation,
  validatePhone,
} from '../index';

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

const ValidationInfo: React.FC<{
  validation: ReturnType<typeof usePhoneValidation>;
}> = ({ validation }) => {
  return (
    <>
      <ValidationProperty title="isValid" value={validation.isValid} />
      <ValidationProperty title="formatMatch" value={validation.formatMatch} />
      <ValidationProperty title="lengthMatch" value={validation.lengthMatch} />
      <ValidationProperty
        title="areaCodeMatch"
        value={validation.areaCodeMatch}
      />
      <ValidationProperty
        title="dialCodeMatch"
        value={validation.dialCodeMatch}
      />
      <ValidationProperty title="country" value={validation.country?.iso2} />
    </>
  );
};

export const Default = () => {
  const [phone, setPhone] = useState('');
  const validation = usePhoneValidation(phone);

  return (
    <div>
      <PhoneInput
        defaultCountry="ua"
        value={phone}
        onChange={(phone) => {
          setPhone(phone);
        }}
      />
      <ValidationInfo validation={validation} />
    </div>
  );
};

export const ValidationWithCountrySaving = () => {
  const [phone, setPhone] = useState('');
  const [currentCountry, setCurrentCountry] = useState<CountryIso2>('ua');
  const validation = usePhoneValidation(phone, { country: currentCountry });

  return (
    <div>
      <PhoneInput
        defaultCountry="ua"
        value={phone}
        onChange={(phone, country) => {
          setPhone(phone);
          setCurrentCountry(country);
        }}
      />
      <ValidationInfo validation={validation} />
    </div>
  );
};

export const ValidationWithDisabledCountryGuessing = () => {
  const [phone, setPhone] = useState('');
  const [shouldSaveCountry, setShouldSaveCountry] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<CountryIso2>('ua');
  const validation = usePhoneValidation(phone, {
    country: shouldSaveCountry ? currentCountry : undefined,
  });

  return (
    <div>
      <input
        type="checkbox"
        id="check"
        checked={shouldSaveCountry}
        onChange={(e) => setShouldSaveCountry(e.target.checked)}
        style={{ marginBottom: '10px' }}
      />
      <label htmlFor="check" style={{ color: 'black' }}>
        Pass selected country to validation
      </label>
      <PhoneInput
        disableCountryGuess
        defaultCountry="ua"
        value={phone}
        onChange={(phone, country) => {
          setPhone(phone);
          setCurrentCountry(country);
        }}
      />
      <ValidationInfo validation={validation} />
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
            defaultCountry="us"
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
        errors.phone = 'Phone is not valid';
      }

      return errors;
    },
  });

  return (
    <div>
      <PhoneInput
        defaultCountry="us"
        value={values.phone}
        onChange={(newPhone) => {
          setFieldTouched('phone');
          setFieldValue('phone', newPhone);
        }}
        inputProps={{
          name: 'phone',
        }}
      />
      <ValidationProperty title="isValid" value={!errors.phone} />
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
        defaultCountry="us"
        value={values.phone}
        onChange={(newPhone) => {
          setFieldTouched('phone');
          setFieldValue('phone', newPhone);
        }}
        inputProps={{
          name: 'phone',
        }}
      />
      <ValidationProperty title="isValid" value={!errors.phone} />
    </div>
  );
};

export default {
  title: 'Validation',
};
