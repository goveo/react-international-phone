import Link from '@docusaurus/Link';
import clsx from 'clsx';
import React from 'react';

import styles from './styles.module.css';

interface FeatureItem {
  emoji: string;
  title: string;
  description: JSX.Element;
}

const features: FeatureItem[] = [
  {
    emoji: '😎',
    title: 'Easy to integrate',
    description: (
      <>
        Just import and use, no need for the initial setup. Integrate with any
        UI library using a headless hook.
      </>
    ),
  },
  {
    emoji: '🌍',
    title: 'Country guessing',
    description: (
      <>
        Just start typing and the component will guess the country and format
        the phone. Country flags are rendered using{' '}
        <Link href="https://twemoji.twitter.com/">Twemoji</Link>.
      </>
    ),
  },
  {
    emoji: '✨',
    title: 'Lightweight',
    description: <>Low bundle size, no third-party dependencies.</>,
  },
  {
    emoji: '🌈',
    title: 'Easy to customize',
    description: <>Customize styles and component behavior using props.</>,
  },
  {
    emoji: '⌨',
    title: 'Caret position handling',
    description: (
      <>
        Typing in the middle of the input, selection and deletion feels
        naturally.
      </>
    ),
  },
  {
    emoji: '✔️',
    title: 'Validation',
    description: (
      <>Easily validate entered phone numbers using provided functions.</>
    ),
  },
];

const Feature: React.FC<FeatureItem> = ({ emoji, title, description }) => {
  return (
    <div
      className={clsx(
        'padding-horiz--md',
        'margin-vert--md',
        'col',
        styles.feature,
      )}
    >
      <h3>
        {emoji} {title}
      </h3>
      <p>{description}</p>
    </div>
  );
};

const HomepageFeatures: React.FC = () => {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <Feature {...features[0]} />
          <Feature {...features[1]} />
          <Feature {...features[2]} />
        </div>
        <div className="row">
          <Feature {...features[3]} />
          <Feature {...features[4]} />
          <Feature {...features[5]} />
        </div>
      </div>
    </section>
  );
};

export default HomepageFeatures;
