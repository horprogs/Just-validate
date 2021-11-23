import JustValidate from './main';
import { Rules } from './interfaces';

let currentLang = 'en';

document.querySelector('#change-lang-btn')?.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'ru' : 'en';
  validation.refresh();
  validation.setCurrentLocale(currentLang);
});

const fetch = (time = 1000, func?: () => boolean) =>
  new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(func?.() || false);
    }, time);
  });

const validation = new JustValidate(
  '#form',
  {
    errorFieldCssClass: 'class-error',
    tooltip: {
      position: 'top',
    },
  },
  [
    {
      key: 'Name is too short',
      dict: {
        ru: 'Имя слишком короткое',
      },
    },
    {
      key: 'Field is required',
      dict: {
        ru: 'Обязательное поле',
      },
    },
  ]
);

validation
  .addField('#name', [
    {
      rule: Rules.MinLength,
      errorMessage: 'Name is too short',
      value: 3,
    },
    {
      rule: Rules.MaxLength,
      value: 15,
    },
  ])
  .addField(
    '#email',
    [
      {
        rule: 'required' as Rules,
        errorMessage: 'Field is required',
      },
      {
        rule: 'email' as Rules,
        errorMessage: 'Email is wrong!',
      },
    ],
    {
      errorFieldStyle: {
        border: '1px solid red',
      },
      errorFieldCssClass: 'field-custom-class-error',
      tooltip: {
        position: 'left',
      },
    }
  )
  .addField(
    '#password',
    [
      {
        rule: 'required' as Rules,
      },
      {
        validator: (value, context) => 1,
      },
    ],
    {
      tooltip: {
        position: 'bottom',
      },
    }
  )
  .addField(
    '#text',
    [
      {
        validator: (value) => {
          return () => fetch(0, () => !!value);
        },
      },
    ],
    {
      tooltip: {
        position: 'bottom',
      },
    }
  )
  .addField('#checkbox', [
    {
      rule: 'required' as Rules,
      validator: (value) => {
        return () => fetch(0, () => !!value);
      },
    },
  ])
  .addField(
    '#pet-select',
    [
      {
        rule: 'required' as Rules,
      },
    ],
    {
      tooltip: {
        position: 'right',
      },
    }
  )
  .addRequiredGroup('#checkbox-group', 'REQUIRED GROUP')
  .addRequiredGroup('#radio-group', undefined, {
    tooltip: {
      position: 'right',
    },
  });
