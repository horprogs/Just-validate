import JustValidate from './main';
import { Rules } from './modules/interfaces';

const fetch = (time = 1000, func?: () => boolean) =>
  new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(func?.() || false);
    }, time);
  });

const advancedExample = () => {
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
    .addField('#repeat-password', [
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
    ])
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
    })
    .onSuccess((event) => {
      console.log('Validation passes and form submitted', event);
    });

  document
    .querySelector('#change-lang-btn-en')
    ?.addEventListener('click', () => {
      validation.setCurrentLocale('en');
    });

  document
    .querySelector('#change-lang-btn-ru')
    ?.addEventListener('click', () => {
      validation.setCurrentLocale('ru');
    });
};

const basicExample = () => {
  const validation = new JustValidate('#basic_form', {
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
  });

  validation
    .addField('#basic_name', [
      {
        rule: 'minNumber' as Rules,
        value: 10,
      },
      {
        rule: 'maxNumber' as Rules,
        value: 100,
      },
    ])
    .onSuccess((ev) => {
      ev?.preventDefault();
      console.log('SUCCESS', ev);
    })
    .onFail((fields) => {
      console.log('FAIL', fields);
    });
  // .addField('#basic_email', [
  //   {
  //     rule: 'required' as Rules,
  //     errorMessage: 'Field is required',
  //   },
  //   {
  //     rule: 'email' as Rules,
  //     errorMessage: 'Email is wrong!',
  //   },
  // ]);
};

basicExample();
advancedExample();