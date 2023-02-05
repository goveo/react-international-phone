import { Button, Input, InputRef } from 'antd';
import React, { useEffect, useRef } from 'react';

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

  // Need to reassign inputRef because antd provides not default ref
  useEffect(() => {
    if (phoneInput.inputRef && inputRef.current?.input) {
      phoneInput.inputRef.current = inputRef.current.input;
    }
  }, [inputRef, phoneInput.inputRef]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <CountrySelector
        selectedCountry={phoneInput.country}
        onSelect={(country) => phoneInput.setCountry(country.iso2)}
        renderButtonWrapper={({ children, rootProps }) => (
          <Button
            {...rootProps}
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
          const value = phoneInput.handlePhoneValueChange(e);
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
