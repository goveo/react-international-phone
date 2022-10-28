import './DialCodePreview.style.scss';

import React from 'react';

import { buildClassNames } from '../../style/buildClassNames';

export interface DialCodePreviewStyleProps {
  style?: React.CSSProperties;
  className?: string;
}

export interface DialCodePreviewProps extends DialCodePreviewStyleProps {
  dialCode: string;
  prefix: string;
  disabled?: boolean;
}

export const DialCodePreview: React.FC<DialCodePreviewProps> = ({
  dialCode,
  prefix,
  disabled,
  style,
  className,
}) => {
  return (
    <div
      className={buildClassNames({
        addPrefix: [
          'dial-code-preview',
          disabled && 'dial-code-preview--disabled',
        ],
        rawClassNames: [className],
      })}
      style={style}
    >{`${prefix}${dialCode}`}</div>
  );
};
