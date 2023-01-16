import React from 'react';
import Layout from '@theme/Layout';
import 'react-toastify/dist/ReactToastify.css';
import Intro from '@site/src/components/Main/Intro';
import Features from '@site/src/components/Main/Features';
import Why from '@site/src/components/Main/Why';
import UsedBy from '@site/src/components/Main/UsedBy';
import Demo from '@site/src/components/Main/Demo';

export default function Home(): JSX.Element {
  return (
    <Layout
      title="JustValidate - modern form validation library written in Typescript"
      description="Modern, simple, lightweight (~5kb gzip) form validation library written in Typescript, with no dependencies (no JQuery!). Support a wide range of predefined rules, async, files, dates validation, custom error messages and styles, localization. Support writing custom rules and plugins."
    >
      <div className="main">
        <Intro />
        <Features />
        <Why />
        <UsedBy />
        <Demo />
      </div>
    </Layout>
  );
}
