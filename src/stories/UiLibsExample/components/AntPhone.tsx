import { Button, Input, InputRef } from 'antd';
import React, { useRef } from 'react';

import { CountrySelector, usePhoneInput } from '../../../index';

interface AntPhoneProps {
  value: string;
  onChange: (phone: string) => void;
}

export const AntPhone: React.FC<AntPhoneProps> = ({ value, onChange }) => {
  const phoneInput = usePhoneInput({
    initialCountry: 'us',
    value,
    onCountryChange: onChange,
  });

  const inputRef = useRef<InputRef>(null);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <CountrySelector
        selectedCountry={phoneInput.country}
        onSelect={(country) => phoneInput.setCountry(country.iso2)}
        renderButtonWrapper={({ children, onClick }) => (
          <Button
            onClick={onClick}
            color="primary"
            style={{
              height: '32px',
              padding: '4px',
              margin: '0 8px',
            }}
          >
            {children}
          </Button>
        )}
      />
      <Input
        color="primary"
        value={phoneInput.phone}
        onChange={(e) => {
          const value = phoneInput.handlePhoneValueChange(
            e as React.ChangeEvent<HTMLInputElement>,
          );
          onChange(value);
        }}
        ref={inputRef}
        style={{
          width: '200px',
        }}
      />
    </div>
  );
};
