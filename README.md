![main image](https://user-images.githubusercontent.com/14051960/144635813-82670c30-44c0-43e6-ad61-1505d5b8d929.png)

[![codecov](https://codecov.io/gh/horprogs/Just-validate/branch/master/graph/badge.svg?token=O6DXXL5TUU)](https://codecov.io/gh/horprogs/Just-validate) <a href="https://bundlephobia.com/result?p=just-validate@latest" target="\_parent"> <img alt="" src="https://badgen.net/bundlephobia/minzip/just-validate@latest" /> </a>
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/6c7a25cc9fdb4bf8869884339418352d)](https://www.codacy.com/gh/horprogs/Just-validate/dashboard?utm_source=github.com\&utm_medium=referral\&utm_content=horprogs/Just-validate\&utm_campaign=Badge_Grade)
[![Known Vulnerabilities](https://snyk.io/test/github/horprogs/Just-validate/badge.svg)](https://snyk.io/test/github/horprogs/Just-validate)
[![Release workflow](https://github.com/horprogs/Just-validate/workflows/Test%20and%20Release/badge.svg)](https://github.com/horprogs/Just-validate/actions)

Modern, simple, lightweight (~5kb gzip) form validation library written in Typescript, with no dependencies (no JQuery!).
Support a wide range of predefined rules, async, files, dates validation, custom error messages and styles, localization.
Supporting writing custom rules and plugins.

***

**NOTE**

**This is documentation for JustValidate 2. If you are looking for the old version, you could find it [here](https://github.com/horprogs/Just-validate/tree/v1).**

***

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

Please, check out the examples https://just-validate.dev/examples/

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

## More fields, group fields and rules

Let's check more advanced example:

```html
<form action="#" id="form" autocomplete="off">
  <div class="row">
    <div class="col">
      <label for="name">Enter your name</label>
      <input
        type="text"
        class="form__input form-control"
        placeholder="Enter your name"
        autocomplete="off"
        name="name"
        id="name"
      />
    </div>
    <div class="col">
      <label for="email">Enter your email</label>
      <input
        type="email"
        class="form__input form-control"
        placeholder="Enter your email"
        autocomplete="off"
        name="email"
        id="email"
      />
    </div>
  </div>
  <div class="form-group mt-3">
    <label for="password">Enter your password</label>
    <input
      type="password"
      class="form__input form-control"
      placeholder="Enter your password"
      autocomplete="off"
      name="password"
      id="password"
    />
  </div>
  <div class="form-group mt-3">
    <label for="password">Repeat your password</label>
    <input
      type="password"
      class="form__input form-control"
      placeholder="Repeat your password"
      autocomplete="off"
      name="repeat-password"
      id="repeat-password"
    />
  </div>
  <div class="form-group mt-3">
    <label for="password">Enter your message</label>
    <textarea
      name="msg"
      cols="30"
      rows="10"
      class="form__textarea form-control"
      id="message"
    ></textarea>
  </div>
  <div class="form-group mt-4">
    <label for="favorite_animal_select" class="form-label"
      >Select you favorite animal</label
    >
    <select name="pets" id="favorite_animal_select" class="form-select">
      <option value="">--Please choose an option--</option>
      <option value="dog">Dog</option>
      <option value="cat">Cat</option>
      <option value="hamster">Hamster</option>
      <option value="parrot">Parrot</option>
      <option value="spider">Spider</option>
      <option value="goldfish">Goldfish</option>
    </select>
  </div>

  <div class="form-group mt-4">
    <div class="form-check">
      <label class="form-check-label" for="consent_checkbox"
        >I agree to provide the information</label
      >
      <input type="checkbox" id="consent_checkbox" class="form-check-input" />
    </div>
  </div>
  <div
    class="form-group mt-4"
    id="read_terms_checkbox_group"
    style="width: 250px"
  >
    <div class="form-check">
      <label class="form-check-label" for="read_terms_checkbox_group_1"
        >I have read Privacy Policy</label
      >
      <input
        type="checkbox"
        name="checkbox-group-fruit"
        id="read_terms_checkbox_group_1"
        class="form-check-input"
      />
    </div>
    <div class="form-check">
      <label class="form-check-label" for="read_terms_checkbox_group_2"
        >I have read Terms Of Use</label
      >
      <input
        type="checkbox"
        name="checkbox-group-fruit"
        id="read_terms_checkbox_group_2"
        class="form-check-input"
      />
    </div>
    <div class="form-check">
      <label class="form-check-label" for="read_terms_checkbox_group_3"
        >I have read Cookies Policy</label
      >
      <input
        type="checkbox"
        name="checkbox-group-fruit"
        id="read_terms_checkbox_group_3"
        class="form-check-input"
      />
    </div>
  </div>
  <div class="mt-4 form-group">
    <div class="pb-1">Please select the preferred way for communication</div>
    <div
      class="form-check"
      id="communication_radio_group"
      style="max-width: 200px"
    >
      <input
        type="radio"
        name="radio"
        class="form-check-input"
        id="communication_radio_group_1"
      />
      <label class="form-check-label" for="communication_radio_group_1">
        Email
      </label>
      <br />
      <input
        type="radio"
        name="radio"
        class="form-check-input"
        id="communication_radio_group_2"
      />
      <label class="form-check-label" for="communication_radio_group_2">
        SMS
      </label>
    </div>
  </div>

  <div class="d-grid mt-4">
    <button class="btn btn-primary" id="submit-btn">Submit</button>
  </div>
</form>
```

```js
const validation = new JustValidate('#form', {
  errorFieldCssClass: 'is-invalid',
});

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
      errorMessage: 'Field is required',
    },
    {
      rule: 'email',
      errorMessage: 'Email is invalid!',
    },
  ])
  .addField('#password', [
    {
      rule: 'password',
    },
  ])
  .addField('#message', [
    {
      validator: (value) => {
        return value[0] === '!';
      },
    },
  ])
  .addField('#consent_checkbox', [
    {
      rule: 'required',
    },
  ])
  .addField('#favorite_animal_select', [
    {
      rule: 'required',
    },
  ])
  .addRequiredGroup(
    '#read_terms_checkbox_group',
    'You should select at least one communication channel'
  )
  .addRequiredGroup('#communication_radio_group')
  .onSuccess((event) => {
    console.log('Validation passes and form submitted', event);
  });
```

## Instance setting

    new JustValidate(
       form: string | Element,
       globalConfig?: {
         errorFieldStyle: Partial<CSSStyleDeclaration>,
         errorFieldCssClass: string,
         errorLabelStyle: Partial<CSSStyleDeclaration>,
         errorLabelCssClass: string,
         lockForm: boolean,
         testingMode: boolean,
         focusInvalidField?: boolean,
         tooltip?: {
           position: 'left' | 'top' | 'right' | 'bottom',
         },
         errorsContainer?: string | Element,
       },
       dictLocale?: {
         key: string;
         dict: {
           [localeKey: string]: string,
         };
       }[];
    );

For example, full setting:

```js
const validation = new JustValidate(
  '#form',
  {
    errorFieldCssClass: 'is-invalid',
    errorFieldStyle: {
      border: '1px solid red',
    },
    errorLabelCssClass: 'is-label-invalid',
    errorLabelStyle: {
      color: 'red',
      textDecoration: 'underlined',
    },
    focusInvalidField: true,
    lockForm: true,
    tooltip: {
      position: 'top',
    },
    errorContainer: '.errors-container',
  },
  [
    {
      key: 'Name is too short',
      dict: {
        ru: 'Имя слишком короткое',
        es: 'El nombre es muy corto',
      },
    },
    {
      key: 'Field is required',
      dict: {
        ru: 'Обязательное поле',
        es: 'Se requiere campo',
      },
    },
  ]
);
```

*   `lockForm` - if true, lock form during validation.
    Could be useful for async validation to make it impossible for user to interact with the form
*   `focusInvalidField` - if true, the first invalid field will be focused after the form submitting
*   `tooltip` if the field defined, tooltips will be displayed instead of regular error labels.
    It has `position` field which could be `'left' | 'top' | 'right' | 'bottom'`
*   localization object will be explained in Localization section
*   `errorsContainer` custom place where to render the error labels

### Methods

Define validation rules for the new field:

    .addField(
      field: string,
      rules: {
        rule?: Rules;
        errorMessage?: string | (
          value: string | boolean,
          context: FieldsInterface
        ) => string);
        validator?: (
          value: string | boolean,
          context: FieldsInterface
        ) => boolean | (() => Promise<boolean>);
        value?: number | string | RegExp;
      },
      config?: {
        errorFieldStyle: Partial<CSSStyleDeclaration>;
        errorFieldCssClass: string;
        errorLabelStyle: Partial<CSSStyleDeclaration>;
        errorLabelCssClass: string;
        successFieldStyle?: Partial<CSSStyleDeclaration>;
        successFieldCssClass: string;
        successLabelStyle?: Partial<CSSStyleDeclaration>;
        successLabelCssClass: string;
        tooltip?: {
          position: 'left' | 'top' | 'right' | 'bottom';
        };
        successMessage?: string;
        errorsContainer?: string | Element;
      }
    )

Make the new group field required. It could be a group of checkboxes or radio buttons.

It means that at least one input in the group should be checked/selected.

    .addRequiredGroup(
        groupField: string,
        errorMessage?: string,
        config?: {
          errorFieldStyle: Partial<CSSStyleDeclaration>;
          errorFieldCssClass: string;
          errorLabelStyle: Partial<CSSStyleDeclaration>;
          errorLabelCssClass: string;
          successFieldStyle?: Partial<CSSStyleDeclaration>;
          successFieldCssClass: string;
          successLabelStyle?: Partial<CSSStyleDeclaration>;
          successLabelCssClass: string;
          tooltip?: {
            position: 'left' | 'top' | 'right' | 'bottom';
          };
          successMessage?: string;
          errorsContainer?: string | Element;
        },
    )

`.onSuccess(event)` - callback if validation success

`.onFail(fields)` - callback if validation failed

If you define `successMessage` argument, this text will be shown if validation (all rules) passes.
You could customize it by defining `successFieldStyle`, `successFieldCssClass`, `successLabelStyle`, `successLabelCssClass`
as we do for error messages.

## Rule object

    {
      rule: string,
      errorMessage?: string | (
          value: string | boolean,
          context: FieldsInterface
        ) => string);
      validator: (
        value: string | boolean,
        context: object
     ) => Boolean | Promise;
     value: number | string;
    }

Field `rule` could be one of these values:

*   `required` - Required field, not empty
*   `email` - Valid email address
*   `minLength` - Limit the minimum text length
*   `maxLength` - Limit the maximum text length
*   `number` - Value should be a number
*   `minNumber` - Number should be more than defined value
*   `maxNumber` - Number should be less than defined value
*   `password` - Minimum eight characters, at least one letter and one number
*   `strongPassword` - Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
*   `customRegexp` - Custom regexp expression
*   `minFilesCount` - Uploaded files count should be more than defined value
*   `maxFilesCount` - Uploaded files count should be less than defined value
*   `files` - Uploaded files attributes should be valid, based on `value` config (check details below in Files validation section)

Field `errorMessage` used for customizing the error message for this rule. It could be a string, or a function which returns a string
(it helps to create conditional messages, based on the field value).

Field `value` used only with `minLength`, `maxLength`, `minNumber`, `maxNumber`, `customRegexp` rules to define the rule value, for example:

```js
validation.addField('#name', [
  {
    rule: 'minLength',
    value: 3,
  },
]);
```

```js
validation.addField('#password', [
  {
    rule: 'customRegexp',
    value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/,
  },
]);
```

Field `validator` used for custom validation. It should return a boolean or a function which returns a Promise.

```js
validation.addField('#text', [
  {
    validator: (value) => value[value.length - 1] === '.',
  },
]);
```

```js
validation.addField('#email', [
  {
    validator: (value) => () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 500);
      });
    },
  },
]);
```

Also, it's possible to do validation based on other fields:

```js
validation.addField('#repeat-password', [
  {
    validator: (value, fields) => {
      if (fields['#password'] && fields['#password'].elem) {
        const repeatPasswordValue = fields['#password'].elem.value;

        return value === repeatPasswordValue;
      }

      return true;
    },
    errorMessage: 'Passwords should be the same',
  },
]);
```

## Files validation

It's possible to validate min/max count of uploaded files and check for type, extension, min/max size and name of uploaded files.

### Uploaded files count

```html
<input type="file" name="file" id="file" multiple />
```

```js
validation.addField('#file', [
  {
    rule: 'minFilesCount',
    value: 1,
  },
  {
    rule: 'maxFilesCount',
    value: 3,
  },
]);
```

### Files attributes validation

```js
validation.addField('#file', [
  {
    rule: 'files',
    value: {
      files: {
        extensions: ['jpeg', 'png'],
        maxSize: 25000,
        minSize: 1000,
        types: ['image/jpeg', 'image/png'],
        names: ['file1.jpeg', 'file2.png'],
      },
    },
  },
]);
```

Format of value for `files` rule:

```
{
  files: {
    extensions?: string[];
    types?: string[];
    minSize?: number;
    maxSize?: number;
    names?: string[];
  }
}

```

`minSize` and `maxSize` should be defined in bytes.

### Date validation

Date validation is performed by a separate plugin [JustValidatePluginDate](https://github.com/horprogs/just-validate-plugin-date) to avoid extending the library size. The plugin uses [date-fns](https://github.com/date-fns/date-fns) for operating with dates.

It is possible to validate for defined format, isAfter, isBefore dates. It works both for text input and for date input.

#### Configuration

`JustValidatePluginDate` takes 1 argument: function which returns config object:

```js
JustValidatePluginDate((fields) => ({
  required: boolean,
  format: string,
  isBefore: Date | string,
  isAfter: Date | string,
}));
```

If it's not required, validation will pass if the value is empty.

It is useful to use `fields` for accessing other fields and their value to set values in the config.

#### Validate for format

```js
import JustValidatePluginDate from 'just-validate-plugin-date';

validation.addField('#date', [
  {
    plugin: JustValidatePluginDate(() => ({
      format: 'dd MMM yyyy',
    })),
    errorMessage: 'Date should be in dd MMM yyyy format (e.g. 20 Dec 2021)',
  },
]);
```

#### Validate for isBefore/isAfter

To be able to validate isBefore/isAfter it's important to define **the same format which supposed to use in isBefore/isAfter**,
otherwise the library will not be able to parse this date string correctly.

```js
import JustValidatePluginDate from 'just-validate-plugin-date';

validation.addField('#date', [
  {
    plugin: JustValidatePluginDate(() => ({
      format: 'dd/MM/yyyy',
      isBefore: '15/12/2021',
      isAfter: '10/12/2021',
    })),
    errorMessage: 'Date should be between 10/12/2021 and 15/12/2021',
  },
]);
```

Also, you could perform validation depends on other fields:

```js
import JustValidatePluginDate from 'just-validate-plugin-date';

validation
  .addField('#date-start', [
    {
      plugin: JustValidatePluginDate(() => ({
        format: 'dd/MM/yyyy',
      })),
      errorMessage: 'Date should be in dd/MM/yyyy format (e.g. 15/10/2021)',
    },
  ])
  .addField('#date-between', [
    {
      plugin: JustValidatePluginDate(() => ({
        format: 'dd/MM/yyyy',
      })),
      errorMessage: 'Date should be in dd/MM/yyyy format (e.g. 15/10/2021)',
    },
    {
      plugin: JustValidatePluginDate((fields) => ({
        format: 'dd/MM/yyyy',
        isAfter: fields['#date-start'].elem.value,
        isBefore: fields['#date-end'].elem.value,
      })),
      errorMessage: 'Date should be between start and end dates',
    },
  ])
  .addField('#date-between-required', [
    {
      plugin: JustValidatePluginDate(() => ({
        required: true,
        format: 'dd/MM/yyyy',
      })),
      errorMessage: 'Date should be in dd/MM/yyyy format (e.g. 15/10/2021)',
    },
    {
      plugin: JustValidatePluginDate((fields) => ({
        required: true,
        format: 'dd/MM/yyyy',
        isAfter: fields['#date-start'].elem.value,
        isBefore: fields['#date-end'].elem.value,
      })),
      errorMessage: 'Date should be between start and end dates',
    },
  ])
  .addField('#date-end', [
    {
      plugin: JustValidatePluginDate(() => ({
        format: 'dd/MM/yyyy',
      })),
      errorMessage: 'Date should be in dd/MM/yyyy format (e.g. 15/10/2021)',
    },
  ]);
```

#### Using with date input

If you use date input, you don't need to define `format` field, because it's always in `yyyy-mm-dd` format,
you just should define isBefore/isAfter:

```js
validation.addField('#date-between', [
  {
    plugin: JustValidatePluginDate((fields) => ({
      isAfter: document.querySelector('#date-start').value,
      isBefore: document.querySelector('#date-end').value,
    })),
    errorMessage: 'Date should be between start and end dates',
  },
]);
```

### Localization

You could define your own translations for different languages. To do that you should define `dictLocale` array, like:

      [
        {
          key: 'Name is too short',
          dict: {
            ru: 'Имя слишком короткое',
            es: 'El nombre es muy corto',
          },
        },
        {
          key: 'Field is required',
          dict: {
            ru: 'Обязательное поле',
            es: 'Se requiere campo',
          },
        },
      ]

Field `key` should be defined as a key string, which also should be defined as `errorMessage` in a rule object.

`dict` should be an object with languages keys with their translations.

To switch a language you should call `validation.setCurrentLocale('ru');`.
The argument for `setCurrentLocale()` method you should pass the key, which you defined in `dict` object,
or you could call with empty argument to set the default language (strings defined in `key` fields).

```js
document.querySelector('#change-lang-btn-en').addEventListener('click', () => {
  validation.setCurrentLocale();
});

document.querySelector('#change-lang-btn-ru').addEventListener('click', () => {
  validation.setCurrentLocale('ru');
});

document.querySelector('#change-lang-btn-es').addEventListener('click', () => {
  validation.setCurrentLocale('es');
});
```

### Plugins

If you need more custom functionality it is possible to write your own plugin. For now there is one official plugin:

*   [JustValidatePluginDate](https://github.com/horprogs/just-validate-plugin-date)
