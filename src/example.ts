import JustValidate from './main';
import { Rules } from './interfaces';

const validation = new JustValidate('#form', {
  errorFieldCssClass: 'class-error',
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
        rule: 'required' as Rules,
        errorMessage: 'Field is required!',
      },
      {
        rule: 'email' as Rules,
        errorMessage: 'Email is wrong!',
      },
    ],
    {
      errorLabelStyle: {
        color: 'red',
        fontWeight: '700',
      },
      errorLabelCssClass: 'label-custom-class-error',
      errorFieldStyle: {
        border: '1px solid red',
      },
      errorFieldCssClass: 'field-custom-class-error',
    }
  )
  .addField('#password', [
    {
      rule: 'required' as Rules,
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
