import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import 'react-toastify/dist/ReactToastify.css';
import Intro from '@site/src/components/Main/Intro';
import Features from '@site/src/components/Main/Features';
import Why from '@site/src/components/Main/Why';
import UsedBy from '@site/src/components/Main/UsedBy';
import Demo from '@site/src/components/Main/Demo';
import Head from '@docusaurus/Head';

export default function Home(): JSX.Element {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <Layout
      title="Modern form validation library written in Typescript"
      description="Modern, simple, lightweight (~5kb gzip) form validation library written in Typescript, with no dependencies (no JQuery!). Support a wide range of predefined rules, async, files, dates validation, custom error messages and styles, localization. Support writing custom rules and plugins."
    >
      <Head>
        <meta property="og:image" content="/img/share.png" />
        <meta name="google-adsense-account" content="ca-pub-8626975577700086" />
      </Head>
      <div className="main">
        <Intro />
        <UsedBy />
        <Features />
        <Why />
        <Demo />

        <ins
          className="adsbygoogle"
          style={{ display: 'block', marginTop: '16px', marginBottom: '16px' }}
          data-ad-client="ca-pub-8626975577700086"
          data-ad-slot="9477879624"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </Layout>
  );
}
