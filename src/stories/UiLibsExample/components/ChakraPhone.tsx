import { Button, ChakraProvider, Input } from '@chakra-ui/react';
import React from 'react';

import { CountrySelector, usePhoneInput } from '../../../index';

interface ChakraPhoneProps {
  value: string;
  onChange: (phone: string) => void;
}

export const ChakraPhone: React.FC<ChakraPhoneProps> = ({
  value,
  onChange,
}) => {
  const phoneInput = usePhoneInput({
    initialCountry: 'us',
    value,
    onCountryChange: onChange,
  });

  return (
    <ChakraProvider>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <CountrySelector
          selectedCountry={phoneInput.country}
          onSelect={(country) => phoneInput.setCountry(country.iso2)}
          renderButtonWrapper={({ children, rootProps }) => (
            <Button {...rootProps} variant="outline" px="4px" mr="8px">
              {children}
            </Button>
          )}
        />
        <Input
          placeholder="Phone number"
          color="primary"
          value={phoneInput.phone}
          onChange={(e) => {
            const value = phoneInput.handlePhoneValueChange(
              e as React.ChangeEvent<HTMLInputElement>,
            );
            onChange(value);
          }}
          width={200}
          ref={phoneInput.inputRef}
        />
      </div>
    </ChakraProvider>
  );
};
