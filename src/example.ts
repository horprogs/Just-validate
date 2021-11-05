import JustValidate from './main';
import { Rules } from './interfaces';

const validation = new JustValidate('#form', {
  errorStyle: {
    color: 'red',
    fontSize: 14,
  },
  errorCssClass: 'class-error',
});

const fetch = () =>
  new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });

validation
  .addField('#name', [
    {
      rule: Rules.MinLength,
      errorMessage: 'Name is too short',
      value: 3,
    },
    {
      rule: Rules.MaxLength,
      errorMessage: 'Name is too long',
      value: 15,
    },
  ])
  .addField(
    '#email',
    [
      {
        rule: 'required',
        errorMessage: 'Field is required!',
      },
      {
        rule: 'email',
        errorMessage: 'Email is wrong!',
      },
    ],
    {
      errorStyle: {
        color: 'blue',
        fontWeight: 700,
      },
      errorCssClass: 'custom-class-error',
    }
  )
  .addField('#password', [
    {
      rule: 'required',
    },
    {
      validator: (value, context) => {
        if (value.length > 12 && value[0] === '!') {
          return true;
        }

        return false;
      },
    },
  ]);
