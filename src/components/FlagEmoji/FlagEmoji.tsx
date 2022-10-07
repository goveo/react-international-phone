// Twemoji is used for emoji rendering
// https://twemoji.twitter.com

import React, { CSSProperties } from 'react';

import { ParsedCountry } from '../../types';

const protocol =
  typeof location !== 'undefined' && location.protocol === 'http:'
    ? 'http:'
    : 'https:';

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
const getFlagCodepointByIso2 = (iso2: string) => {
  if (iso2.length !== 2) {
    console.error('Wrong iso2 code');
    return undefined;
  }
  return [codepoints[iso2[0]], codepoints[iso2[1]]].join('-');
};

interface FlagEmojiProps extends React.HTMLAttributes<HTMLImageElement> {
  iso2?: ParsedCountry['iso2'];
  size?: CSSProperties['width'];
}

export const FlagEmoji: React.FC<FlagEmojiProps> = ({
  iso2,
  size = '24px',
  ...restProps
}) => {
  if (!iso2) {
    // render empty image to save place for flag
    return <img width={size} height={size} {...restProps} />;
  }

  const flagCodepoint = getFlagCodepointByIso2(iso2);
  const src = `${protocol}//twemoji.maxcdn.com/2/svg/${flagCodepoint}.svg`;

  return (
    <img
      src={src}
      width={size}
      height={size}
      draggable={false}
      {...restProps}
    />
  );
};
