import { Button, ChakraProvider, Input } from '@chakra-ui/react';
import React, { useEffect } from 'react';

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
    defaultCountry: 'us',
    value,
  });

  useEffect(() => {
    if (phoneInput.phone === value) return;
    onChange?.(phoneInput.phone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneInput.phone]);

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
          type="tel"
          color="primary"
          value={phoneInput.phone}
          onChange={phoneInput.handlePhoneValueChange}
          width={200}
          ref={phoneInput.inputRef}
        />
      </div>
    </ChakraProvider>
  );
};
