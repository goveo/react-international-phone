// Twemoji is used for emoji rendering
// https://twemoji.twitter.com

import './FlagEmoji.style.scss';

import React, { CSSProperties } from 'react';

import { buildClassNames } from '../../style/buildClassNames';
import { ParsedCountry } from '../../types';

const incrementCodepoint = (codePoint: string, incrementBy: number): string => {
  const decimal = parseInt(codePoint, 16);
  return Number(decimal + incrementBy).toString(16);
};

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const A_LETTER_CODEPOINT = '1f1e6';
const codepoints: Record<string, string> = alphabet
  .split('')
  .reduce((obj, currentLetter, index) => {
    return {
      ...obj,
      // construct alphabet by incrementing A letter codepoint value
      [currentLetter]: incrementCodepoint(A_LETTER_CODEPOINT, index),
    };
  }, {});

/**
 * Flag emoji value contains 2 emojis which represents iso2 code
 * For example: '🇺🇦' -> U+1F1FA (U letter), U+1F1E6 (A letter)
 * For Twemoji we need to pass codepoints in format `1f1fa-1f1e6`
 */
const getFlagCodepointByIso2 = (iso2: ParsedCountry['iso2']) => {
  return [codepoints[iso2[0]], codepoints[iso2[1]]].join('-');
};

interface FlagEmojiProps extends React.HTMLAttributes<HTMLImageElement> {
  iso2?: ParsedCountry['iso2'];
  size?: CSSProperties['width'];
  src?: string;
  protocol?: 'http' | 'https';
  disableLazyLoading?: boolean;
}

export const FlagEmoji: React.FC<FlagEmojiProps> = ({
  iso2,
  size,
  src,
  protocol = 'https',
  disableLazyLoading,
  className,
  style,
  ...restProps
}) => {
  if (!iso2) {
    // render empty image to save place for flag
    return (
      <img
        className={buildClassNames({
          addPrefix: ['flag-emoji'],
          rawClassNames: [className],
        })}
        width={size}
        height={size}
        {...restProps}
      />
    );
  }

  const getSrc = () => {
    if (src) return src;

    const flagCodepoint = getFlagCodepointByIso2(iso2);
    return `${protocol}://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${flagCodepoint}.svg`;
  };

  return (
    <img
      className={buildClassNames({
        addPrefix: ['flag-emoji'],
        rawClassNames: [className],
      })}
      src={getSrc()}
      width={size}
      height={size}
      draggable={false}
      data-country={iso2}
      loading={disableLazyLoading ? undefined : 'lazy'}
      style={{
        width: size,
        height: size,
        ...style,
      }}
      {...restProps}
    />
  );
};
