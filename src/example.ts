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
    errorFieldCssClass: 'is-invalid',
    tooltip: {
      position: 'top',
    },
    lockForm: false,
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
      rule: 'minNumber' as Rules,
      value: 10,
    },
    {
      rule: 'maxNumber' as Rules,
      value: 100,
    },
  ])
  .addField('#email', [
    {
      rule: 'required' as Rules,
      errorMessage: 'Field is required',
    },
    {
      rule: 'email' as Rules,
      errorMessage: 'Email is wrong!',
    },
  ])
  .addField(
    '#password',
    [
      {
        rule: 'required' as Rules,
      },
    ],
    {
      tooltip: {
        position: 'bottom',
      },
    }
  )
  .addField(
    '#message',
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
  .addField(
    '#consent_checkbox',
    [
      {
        rule: 'required' as Rules,
      },
    ],
    {
      tooltip: {
        position: 'left',
      },
    }
  )
  .addField(
    '#favorite_animal_select',
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
  .addRequiredGroup(
    '#read_terms_checkbox_group',
    'You should select at least one communication channel',
    {
      tooltip: {
        position: 'right',
      },
    }
  )
  .addRequiredGroup('#communication_radio_group', undefined, {
    tooltip: {
      position: 'right',
    },
  });
