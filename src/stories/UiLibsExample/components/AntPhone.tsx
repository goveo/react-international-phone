import { Button, Input, InputRef } from 'antd';
import React, { useEffect, useRef } from 'react';

import { CountrySelector, usePhoneInput } from '../../../index';

interface AntPhoneProps {
  value: string;
  onChange: (phone: string) => void;
}

export const AntPhone: React.FC<AntPhoneProps> = ({ value, onChange }) => {
  const phoneInput = usePhoneInput({
    defaultCountry: 'us',
    value,
    onChange: (data) => {
      onChange(data.phone);
    },
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
      <Input.Group compact>
        <CountrySelector
          selectedCountry={phoneInput.country}
          onSelect={(country) => phoneInput.setCountry(country.iso2)}
          renderButtonWrapper={({ children, rootProps }) => (
            <Button
              {...rootProps}
              style={{
                height: '32px',
                padding: '4px',
                // make the right border square
                borderEndEndRadius: '0px',
                borderStartEndRadius: '0px',
                // fix on click effect overlap
                zIndex: 1,
              }}
            >
              {children}
            </Button>
          )}
          dropdownStyleProps={{
            style: {
              top: '35px',
            },
          }}
        />
        <Input
          placeholder="Phone number"
          type="tel"
          value={phoneInput.phone}
          onChange={phoneInput.handlePhoneValueChange}
          ref={inputRef}
          style={{
            width: '200px',
          }}
        />
      </Input.Group>
    </div>
  );
};
