import { Meta } from '@storybook/react';
import React, { useRef, useState } from 'react';

import { CountrySelectorStyleProps } from '../components/CountrySelector/CountrySelector';
import {
  PhoneInput,
  PhoneInputRefType,
} from '../components/PhoneInput/PhoneInput';
import { defaultCountries } from '../data/countryData';
import { parseCountry } from '../index';
import { MuiPhone } from './UiLibsExample/components/MuiPhone';

export default {
  title: 'Dev',
  // includeStories: [], // Comment this line to show stories
} as Meta;

const Title: React.FC<{
  children: string;
  marginBottom?: React.CSSProperties['marginBottom'];
}> = ({ children, marginBottom }) => {
  return (
    <div
      style={{
        color: '#111',
        fontSize: '13px',
        marginBottom: marginBottom ?? '8px',
      }}
    >
      {children}
    </div>
  );
};

const PhoneWrapper: React.FC = ({ children }) => {
  return <div style={{ marginBottom: '20px' }}>{children}</div>;
};

export const Demo = () => {
  const [phone, setPhone] = useState('+1');
  const [phone2, setPhone2] = useState('+372');
  const [muiPhone, setMuiPhone] = useState('+380');

  const countrySelectorStyleProps: CountrySelectorStyleProps = {
    dropdownStyleProps: {
      style: {
        // to avoid overlap with mui label
        zIndex: 2,
      },
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Title>Default</Title>
      <PhoneWrapper>
        <PhoneInput
          defaultCountry="us"
          value={phone}
          onChange={setPhone}
          countrySelectorStyleProps={countrySelectorStyleProps}
        />
      </PhoneWrapper>
      <Title>Forced dial code + filtered countries</Title>
      <PhoneWrapper>
        <PhoneInput
          defaultCountry="ee"
          value={phone2}
          onChange={setPhone2}
          forceDialCode
          countries={defaultCountries.filter((c) =>
            ['lt', 'lv', 'ee'].includes(parseCountry(c).iso2),
          )}
          countrySelectorStyleProps={countrySelectorStyleProps}
        />
      </PhoneWrapper>
      <Title marginBottom="20px">Material UI + validation</Title>
      <PhoneWrapper>
        <MuiPhone value={muiPhone} onChange={setMuiPhone} />
      </PhoneWrapper>
    </div>
  );
};

export const RerenderTest = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [phone, setPhone] = useState('+1234567');

  if (!isVisible) {
    return <button onClick={() => setIsVisible(true)}>Show</button>;
  }

  return (
    <div>
      <PhoneInput
        value={phone}
        onChange={setPhone}
        defaultCountry="nl"
        placeholder="Test Placeholder"
        inputProps={{ autoFocus: true }}
      />
      <button onClick={() => setIsVisible(false)}>Hide</button>
    </div>
  );
};

export const ControlledInputTest = () => {
  const [phone, setPhone] = useState('+1 ');

  return <PhoneInput value={phone} onChange={setPhone} defaultCountry="ca" />;
};

export const TwoInputsTest = () => {
  const [phone, setPhone] = useState('+1 ');

  return (
    <div>
      <p style={{ color: 'black' }}>Phone: {phone}</p>
      <PhoneInput
        value={phone}
        onChange={setPhone}
        defaultCountry="us"
        inputProps={{ id: 'top' }}
      />

      <PhoneInput
        value={phone}
        onChange={setPhone}
        defaultCountry="us"
        inputProps={{ id: 'bottom' }}
      />
    </div>
  );
};

export const WrongDefaultCountryCode = () => {
  const [phone, setPhone] = useState('');

  return (
    <PhoneInput
      value={phone}
      onChange={setPhone}
      defaultCountry="not-valid-code"
    />
  );
};

export const WithoutDialCode = () => {
  const [phone, setPhone] = useState('+14041234567');

  return (
    <div style={{ color: 'black', fontSize: '13px' }}>
      <span>Phone: {phone}</span>
      <PhoneInput value={phone} onChange={setPhone} disableDialCodeAndPrefix />
    </div>
  );
};

export const Ref = () => {
  const [phone, setPhone] = useState('');

  const ref = useRef<PhoneInputRefType>(null);

  return (
    <div
      style={{
        color: 'black',
        fontSize: '13px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        maxWidth: '230px',
        gap: '10px',
      }}
    >
      <div>Phone: {phone}</div>
      <PhoneInput value={phone} onChange={setPhone} ref={ref} />

      <button
        onClick={() => {
          if (!ref.current) return;

          ref.current.setCountry('ua');
          ref.current.focus();
        }}
      >
        Set Ukraine
      </button>

      <div
        style={{
          height: '150vh',
          background: 'ghostwhite',
        }}
      >
        Scroll to bottom
      </div>
      <button
        onClick={() => {
          if (!ref.current) return;
          ref.current.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        Scroll to phone
      </button>
    </div>
  );
};

export const Test = () => {
  const [phone, setPhone] = useState('+1');

  return (
    <div style={{ color: 'black', fontSize: '13px' }}>
      <div>
        <button
          onClick={() => {
            setPhone('+12041234567');
          }}
        >
          Set Canada
        </button>
      </div>

      <span>Phone: {phone}</span>
      <PhoneInput value={phone} onChange={setPhone} disableDialCodeAndPrefix />
    </div>
  );
};
