import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React from 'react';

import styles from './index.module.css';

const HomepageHeader: React.FC = () => {
  const { siteConfig } = useDocusaurusContext();
  const { colorMode } = useColorMode();

  return (
    <header className={clsx('hero hero--primary', styles.banner)}>
      <div className="container">
        <h1 className={styles.title}>{siteConfig.title}</h1>
        <p className={styles.subtitle}>{siteConfig.tagline}</p>
        <div
          className={clsx(
            styles['phone'],
            colorMode === 'dark' && styles['phone--dark'],
            'margin-vert--lg',
          )}
        >
          <BrowserOnly fallback={<div>Loading...</div>}>
            {() => {
              const { PhoneInput } = require('react-international-phone');
              return (
                <PhoneInput
                  initialCountry="ua"
                  inputProps={{
                    autoFocus: true,
                  }}
                />
              );
            }}
          </BrowserOnly>
        </div>
        <Link
          className="button button--secondary button--lg"
          to="/docs/getting-started"
        >
          📚 Go to documentation
        </Link>
      </div>
    </header>
  );
};

const Home: React.FC = () => {
  return (
    <Layout description="International phone input component for React">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
};

export default Home;
