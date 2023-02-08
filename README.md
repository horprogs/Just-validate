<img width="1223" alt="Screenshot 2023-01-16 at 23 35 59" src="https://user-images.githubusercontent.com/14051960/212780398-0a2512bc-9584-41b2-af04-8cd8aa99b18c.png">


[![codecov](https://codecov.io/gh/horprogs/Just-validate/branch/master/graph/badge.svg?token=O6DXXL5TUU)](https://codecov.io/gh/horprogs/Just-validate) <a href="https://bundlephobia.com/result?p=just-validate@latest" target="\_parent"> <img alt="" src="https://badgen.net/bundlephobia/minzip/just-validate@latest" /> </a>
[![npm](https://img.shields.io/npm/dm/just-validate?style=flat)](https://www.npmjs.org/package/just-validate)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/6c7a25cc9fdb4bf8869884339418352d)](https://www.codacy.com/gh/horprogs/Just-validate/dashboard?utm_source=github.com\&utm_medium=referral\&utm_content=horprogs/Just-validate\&utm_campaign=Badge_Grade)
[![Known Vulnerabilities](https://snyk.io/test/github/horprogs/Just-validate/badge.svg)](https://snyk.io/test/github/horprogs/Just-validate)
[![Release workflow](https://github.com/horprogs/Just-validate/workflows/Test%20and%20Release/badge.svg)](https://github.com/horprogs/Just-validate/actions)

Modern, simple, lightweight (~5kb gzip) form validation library written in Typescript, with no dependencies (no JQuery!).
Support a wide range of predefined rules, async, files, dates validation, custom error messages and styles, localization.
Supporting writing custom rules and plugins.

## Why JustValidate?

It's a right choice for you, if you have a site, a landing page without React, JQuery etc.
and you want to quick, simple and powerful solution for validating your form.

## Features

*   small size and zero dependencies
*   no need to change your HTML
*   a wide range of pre-defined rules
*   custom rules
*   support plugins
*   custom styles and css classes for invalid fields and error messages
*   custom messages
*   showing tooltips as error messages
*   custom places for the error labels
*   localization (defining error messages for different languages)
*   user-friendly setup: console warning messages if something incorrect
*   written in Typescript and good test coverage

## Installation

### npm

```shell
npm install just-validate --save
```

### yarn

```shell
yarn add just-validate
```

And then use it as an imported module:

```js
import JustValidate from 'just-validate';

const validate = new JustValidate('#form');
```

Or if you don't use module bundlers, just include JustValidate script on your page from CDN and call it as `window.JustValidate`:

```html
<script src="https://unpkg.com/just-validate@latest/dist/just-validate.production.min.js"></script>
<body>
  <script>
    const validate = new window.JustValidate('#form');
  </script>
</body>
```

## Predefined rules

There are plenty of rules which you could use out of the box:

*   required, non-empty fields
*   valid email address
*   min/max text length
*   valid number
*   min/max number
*   valid password
*   valid strong password
*   check for the custom regexp
*   min/max count of uploaded files
*   min/max size, types, extensions, names of uploaded files
*   format date, check for isAfter/isBefore dates

## Quick start

Let's say we have a basic HTML layout:

```html
<form action="#" id="form" autocomplete="off">
  <label for="name">Enter your name</label>
  <input
    type="text"
    class="form__input form-control"
    placeholder="Enter your name"
    autocomplete="off"
    name="name"
    id="name"
  />
  <label for="email">Enter your email</label>
  <input
    type="email"
    class="form__input form-control"
    placeholder="Enter your email"
    autocomplete="off"
    name="email"
    id="email"
  />
  <button class="btn btn-primary" id="submit-btn">Submit</button>
</form>
```

Next, let's add JustValidate to our layout and define some simple rules.

First, we should create the instance `new JustValidate('#form')` by passing a form selector, or the element as an argument.

Second, we call `.addField()` with a field selector as the first argument and an array of rules as the second argument.

```js
const validation = new JustValidate('#form');

validation
  .addField('#name', [
    {
      rule: 'minLength',
      value: 3,
    },
    {
      rule: 'maxLength',
      value: 30,
    },
  ])
  .addField('#email', [
    {
      rule: 'required',
      errorMessage: 'Email is required',
    },
    {
      rule: 'email',
      errorMessage: 'Email is invalid!',
    },
  ]);
```

And that's it! Now our form is validated!

## More

Please, check out the [examples](https://just-validate.dev/examples/) and [documentation](https://just-validate.dev/docs/intro/). Or try the [playground](https://just-validate.dev/playground/).
