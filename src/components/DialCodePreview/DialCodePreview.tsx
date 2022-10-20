import './DialCodePreview.style.scss';

import React from 'react';

import { buildClassNames } from '../../style/buildClassNames';

interface DialCodePreviewProps {
  dialCode: string;
  prefix: string;
  disabled?: boolean;
}

export const DialCodePreview: React.FC<DialCodePreviewProps> = ({
  dialCode,
  prefix,
  disabled,
}) => {
  return (
    <div
      className={buildClassNames(
        'dial-code-preview',
        disabled && 'dial-code-preview--disabled',
      )}
    >{`${prefix}${dialCode}`}</div>
  );
};
