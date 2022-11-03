import React from 'react';

import styles from './styles.module.css';

interface FeatureItem {
  emoji: string;
  title: string;
  description: JSX.Element;
}

const FeatureList: FeatureItem[] = [
  {
    emoji: '😎',
    title: 'Easy to integrate',
    description: <>HTML input under the hood</>,
  },
  {
    emoji: '🔍',
    title: 'Country guessing',
    description: <>Just start typing and component will guess the country</>,
  },
  {
    emoji: '🏳️',
    title: 'Country flag render',
    description: (
      <>Render flags using [Twemoji](https://twemoji.twitter.com/)</>
    ),
  },
  {
    emoji: '⌨',
    title: 'Cursor position handling',
    description: <>Typing in the middle of input value feels naturally</>,
  },
  {
    emoji: '✨',
    title: 'Lightweight',
    description: <>No third-party dependencies</>,
  },
];

const Feature: React.FC<FeatureItem> = ({ emoji, title, description }) => {
  return (
    <div className="padding-horiz--md">
      <p>
        <span className="text--bold">
          {emoji} {title}
        </span>
        {': '}
        {description}
      </p>
    </div>
  );
};

const HomepageFeatures: React.FC = () => {
  return (
    <section className={styles.features}>
      <div className="container">
        <div>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomepageFeatures;
