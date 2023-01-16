import React from 'react';
import CodeBlock from '@theme/CodeBlock';

const Why = () => {
  return (
    <div className="mt-80">
      <h2 className="title">Why JustValidate?</h2>
      <div className="subtitle">
        It's a right choice for you, if you have a site, a landing page without
        React, JQuery etc. and you want to quick, simple and powerful solution
        for validating your form.
      </div>

      <div className="why mt-30">
        <div className="why-item">
          <div className="why-item-content">
            <div className="why-item__title">Quick to get started</div>
            <div className="why-item__text">
              Set up JustValidate with one command and start using. The library
              has some default settings, including styles and messages.
            </div>
          </div>
          <div className="why-item-code">
            <CodeBlock language="bash">{`yarn add just-validate`}</CodeBlock>
            <div>or using NPM</div>
            <CodeBlock language="bash">
              {`npm install just-validate --save`}
            </CodeBlock>
            <div>and then import it as a module</div>
            <CodeBlock language="javascript">
              {`import JustValidate from 'just-validate';`}
            </CodeBlock>
            <div>or include the script directly to your HTML</div>
            <CodeBlock language="html">
              {`<script src="https://unpkg.com/just-validate@latest/dist/just-validate.production.min.js"></script>`}
            </CodeBlock>
            <div>and then use it as</div>
            <CodeBlock language="javascript">{`window.JustValidate`}</CodeBlock>
          </div>
        </div>

        <div className="why-item">
          <div className="why-item-content">
            <div className="why-item__title">Plenty of pre-defined rules</div>
            <div className="why-item__text">
              JustValidate has 14 rules, including dates and files validation.
            </div>
          </div>
          <div className="why-item-code">
            <CodeBlock language="bash" className="code">
              {`
validator
  .addField(document.querySelector('#basic_name'), [
    {
      rule: 'required',
    },
    {
      rule: 'minLength',
      value: 3,
    },
    {
      rule: 'maxLength',
      value: 15,
    },
  ])
  .addField(document.querySelector('#basic_email'), [
    {
      rule: 'required',
    },
    {
      rule: 'email',
    },
  ])
  .addField(document.querySelector('#basic_password'), [
    {
      rule: 'required',
    },
    {
      rule: 'password',
    },
  ])
  .addField(document.querySelector('#basic_age'), [
    {
      rule: 'required',
    },
    {
      rule: 'number',
    },
    {
      rule: 'minNumber',
      value: 18,
    },
    {
      rule: 'maxNumber',
      value: 150,
    },
  ]);
              `}
            </CodeBlock>
          </div>
        </div>

        <div className="why-item">
          <div className="why-item-content">
            <div className="why-item__title">Highly customizable</div>
            <div className="why-item__text">
              You could define messages and success labels in different
              languages, use tooltips, write your own validation rules
              (including async), write your own plugins and more.
            </div>
          </div>
          <div className="why-item-code">
            <CodeBlock language="javascript">
              {`
validator
  .addField('#async_email', [
    {
      rule: 'required',
    },
    {
      validator: () => () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(false);
          }, 1000);
        }),
      errorMessage: 'Email already exists!',
    },
  ])              
              `}
            </CodeBlock>
            <CodeBlock language="javascript">
              {`
validator
  .addField('#date-text_start_date', [
    {
      rule: 'required',
    },
    {
      plugin: JustValidatePluginDate(() => ({
        format: 'dd/MM/yyyy',
      })),
      errorMessage:
        'Date should be in dd/MM/yyyy format (e.g. 20/12/2021)',
    },
  ])
              `}
            </CodeBlock>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Why;
