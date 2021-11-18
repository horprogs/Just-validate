import JustValidate from './main';
import { Rules } from './interfaces';

let currentLang = 'en';

document.querySelector('#change-lang-btn')?.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'ru' : 'en';
  validation.refresh();
  validation.setCurrentLocale(currentLang);
});

const validation = new JustValidate(
  '#form',
  {
    errorFieldCssClass: 'class-error',
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

const fetch = (time = 1000, func?: () => boolean) =>
  new Promise<boolean>((resolve) => {
    setTimeout(() => {
      console.log('Fetch returns response');
      resolve(func?.() || false);
    }, time);
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
        if (typeof value !== 'string') {
          return false;
        }

        if (value.length > 12 && value[0] === '!') {
          return true;
        }

        return false;
      },
    },
  ])
  .addField('#text', [
    {
      validator: (value) => {
        return () => fetch(0, () => !!value);
      },
    },
  ])
  .addField('#checkbox', [
    {
      rule: 'required' as Rules,
      validator: (value) => {
        return () => fetch(0, () => !!value);
      },
    },
  ])
  .addField('#pet-select', [
    {
      rule: 'required' as Rules,
    },
  ])
  .addRequiredGroup('#checkbox-group', 'REQUIRED GROUP')
  .addRequiredGroup('#radio-group');
