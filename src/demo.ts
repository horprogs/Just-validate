/* eslint-disable no-console */
import JustValidatePluginDate from 'just-validate-plugin-date';
import JustValidate from './main';
import { Rules } from './modules/interfaces';

interface MyNamespacedWindow extends Window {
  showNotification: () => void;
  fakeFetch: (val: number) => Promise<any>;
}

declare const window: MyNamespacedWindow;

const basic = (): void => {
  const validation = new JustValidate('#basic-validation-form', {
    errorFieldCssClass: 'is-invalid  custom-class',
    errorLabelStyle: {
      fontSize: '14px',
      color: '#dc3545',
    },
    focusInvalidField: true,
    lockForm: true,
  });

  validation
    .addField('#example1_name', [
      {
        rule: 'minLength' as Rules,
        value: 3,
      },
      {
        rule: 'maxLength' as Rules,
        value: 15,
      },
    ])
    .addField('#example1_email', [
      {
        rule: 'required' as Rules,
      },
      {
        rule: 'email' as Rules,
      },
    ])
    .addField('#example1_password', [
      {
        rule: 'password' as Rules,
      },
    ])
    .addField('#example1_age', [
      {
        rule: 'number' as Rules,
      },
      {
        rule: 'minNumber' as Rules,
        value: 18,
      },
      {
        rule: 'maxNumber' as Rules,
        value: 150,
      },
    ])
    .onSuccess((ev) => {
      ev?.preventDefault();
      window.showNotification();
    });
};

const advanced = (): void => {
  const validation = new JustValidate('#more-fields-validation-form', {
    errorFieldCssClass: 'is-invalid',
    errorLabelStyle: {
      fontSize: '14px',
      color: '#dc3545',
    },
    successFieldCssClass: 'is-valid',
    focusInvalidField: true,
    lockForm: true,
  });

  validation
    .addField('#example2_password', [
      {
        rule: 'required' as Rules,
      },
    ])
    .addField('#example2_repeat-password', [
      {
        rule: 'required' as Rules,
      },
      {
        validator: (value, fields): boolean => {
          if (
            fields['#example2_password'] &&
            fields['#example2_password'].elem
          ) {
            const repeatPasswordValue = fields['#example2_password'].elem.value;

            return value === repeatPasswordValue;
          }

          return true;
        },
        errorMessage: 'Passwords should be the same',
      },
    ])
    .addField('#example2_message', [
      {
        validator: (value): boolean => {
          return value !== undefined && (value as string).length > 3;
        },
        errorMessage: 'Message should be more than 3 letters.',
      },
    ])
    .addField('#example2_consent_checkbox', [
      {
        rule: 'required' as Rules,
      },
    ])
    .addField('#example2_favorite_animal_select', [
      {
        rule: 'required' as Rules,
      },
    ])
    .addRequiredGroup(
      '#example2_read_terms_checkbox_group',
      'You should select at least one communication channel'
    )
    .addRequiredGroup('#example2_communication_radio_group')
    .onSuccess((event) => {
      event?.preventDefault();
      window.showNotification();
    });
};

const async = (): void => {
  const validation = new JustValidate('#async-validation-form', {
    errorFieldCssClass: 'is-invalid',
    errorLabelStyle: {
      fontSize: '14px',
      color: '#dc3545',
    },
    focusInvalidField: true,
    lockForm: true,
  });

  validation
    .addField('#example3_name', [
      {
        validator: () => {
          return (): Promise<boolean> => window.fakeFetch(500);
        },
        errorMessage: 'Name already exists',
      },
    ])
    .onSuccess((event) => {
      event?.preventDefault();
      window.showNotification();
    });
};

const tooltips = (): void => {
  const validation = new JustValidate('#tooltips-validation-form', {
    errorFieldCssClass: 'is-invalid',
    errorLabelStyle: {
      fontSize: '14px',
      color: '#dc3545',
    },
    focusInvalidField: true,
    lockForm: true,
    tooltip: {
      position: 'top',
    },
  });

  validation
    .addField('#example4_name', [
      {
        rule: 'required' as Rules,
      },
      {
        rule: 'minLength' as Rules,
        value: 3,
      },
      {
        rule: 'maxLength' as Rules,
        value: 15,
      },
    ])
    .addField(
      '#example4_email',
      [
        {
          rule: 'required' as Rules,
          errorMessage: 'Email is required',
        },
        {
          rule: 'email' as Rules,
          errorMessage: 'Email is invalid',
        },
      ],
      {
        tooltip: {
          position: 'bottom',
        },
      }
    )
    .addField(
      '#example4_consent_checkbox',
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
      '#example4_favorite_animal_select',
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
      '#example4_read_terms_checkbox_group',
      'You should select at least one communication channel',
      {
        tooltip: {
          position: 'right',
        },
      }
    )
    .addRequiredGroup('#example4_communication_radio_group', undefined, {
      tooltip: {
        position: 'right',
      },
    })
    .onSuccess((event) => {
      console.log('Validation passes and form submitted', event);
    });
};

const localization = (): void => {
  const validation = new JustValidate(
    '#localization-validation-form',
    {
      errorFieldCssClass: 'is-invalid',
      errorLabelStyle: {
        fontSize: '14px',
        color: '#dc3545',
      },
      focusInvalidField: true,
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
        key: 'Name is too long',
        dict: {
          ru: 'Имя слишком длинное',
          es: 'El nombre es demasiado largo',
        },
      },
      {
        key: 'Email is required',
        dict: {
          ru: 'Еmail - обязательное поле',
          es: 'Correo electronico es requerido',
        },
      },
      {
        key: 'Email is invalid',
        dict: {
          ru: 'Указан некорректный Email',
          es: 'El correo electrónico es invalido',
        },
      },
    ]
  );

  validation
    .addField('#example5_name', [
      {
        rule: 'required' as Rules,
      },
      {
        rule: 'minLength' as Rules,
        value: 3,
        errorMessage: 'Name is too short',
      },
      {
        rule: 'maxLength' as Rules,
        value: 15,
        errorMessage: 'Name is too long',
      },
    ])
    .addField('#example5_email', [
      {
        rule: 'required' as Rules,
        errorMessage: 'Email is required',
      },
      {
        rule: 'email' as Rules,
        errorMessage: 'Email is invalid',
      },
    ])
    .onSuccess((ev) => {
      ev?.preventDefault();
      window.showNotification();
    });

  document
    .querySelector('#change-lang-btn-en')
    ?.addEventListener('click', () => {
      validation.setCurrentLocale();
    });

  document
    .querySelector('#change-lang-btn-ru')
    ?.addEventListener('click', () => {
      validation.setCurrentLocale('ru');
    });

  document
    .querySelector('#change-lang-btn-es')
    ?.addEventListener('click', () => {
      validation.setCurrentLocale('es');
    });
};

const conditional = (): void => {
  const validation = new JustValidate('#conditional-validation-form', {
    errorFieldCssClass: 'is-invalid',
    errorLabelStyle: {
      fontSize: '14px',
      color: '#dc3545',
    },
    focusInvalidField: true,
    lockForm: true,
  });

  validation.onSuccess((ev) => {
    ev?.preventDefault();
    window.showNotification();
  });

  document
    .querySelector('#example6_checkbox')
    ?.addEventListener('click', (e) => {
      if ((e.target as HTMLInputElement).checked) {
        validation.addField('#example6_name', [
          {
            rule: 'required' as Rules,
          },
        ]);
      } else {
        validation.removeField('#example6_name');
      }
    });
};

const files = (): void => {
  const validation = new JustValidate('#files-form', {
    errorFieldCssClass: 'is-invalid',
    errorLabelStyle: {
      fontSize: '14px',
      color: '#dc3545',
    },
    focusInvalidField: true,
    lockForm: true,
  });

  validation
    .addField('#example7_minmax', [
      {
        rule: 'minFilesCount' as Rules,
        value: 1,
      },
      {
        rule: 'maxFilesCount' as Rules,
        value: 3,
      },
    ])
    .addField('#example7_png', [
      {
        rule: 'minFilesCount' as Rules,
        value: 1,
      },
      {
        rule: 'maxFilesCount' as Rules,
        value: 1,
      },
      {
        rule: 'files' as Rules,
        value: {
          files: {
            types: ['image/png'],
            extensions: ['png'],
          },
        },
      },
    ])
    .addField('#example7_attr', [
      {
        rule: 'files' as Rules,
        value: {
          files: {
            extensions: ['jpeg', 'jpg', 'png'],
            maxSize: 25000,
            minSize: 10000,
            types: ['image/jpeg', 'image/jpg', 'image/png'],
          },
        },
      },
    ])
    .onSuccess((ev) => {
      ev?.preventDefault();
      window.showNotification();
    });
};

const dateTextInput = (): void => {
  const validation = new JustValidate('#date-text-input-form', {
    errorFieldCssClass: 'is-invalid',
    errorLabelStyle: {
      fontSize: '14px',
      color: '#dc3545',
    },
    focusInvalidField: true,
    lockForm: true,
  });

  validation
    .addField('#example8_start_date', [
      {
        plugin: JustValidatePluginDate(() => ({
          format: 'dd/MM/yyyy',
        })),
        errorMessage: 'Date should be in dd/MM/yyyy format',
      },
    ])
    .addField('#example8_between_date', [
      {
        plugin: JustValidatePluginDate(() => ({
          format: 'dd/MM/yyyy',
        })),
        errorMessage: 'Date should be in dd/MM/yyyy format',
      },
      {
        plugin: JustValidatePluginDate((fields) => ({
          format: 'dd/MM/yyyy',
          isAfter: fields['#example8_start_date'].elem.value,
          isBefore: fields['#example8_end_date'].elem.value,
        })),
        errorMessage: 'Date should be between start and end dates',
      },
    ])
    .addField('#example8_end_date', [
      {
        plugin: JustValidatePluginDate(() => ({
          format: 'dd/MM/yyyy',
        })),
        errorMessage: 'Date should be in dd/MM/yyyy format',
      },
    ])
    .addField('#example8_format', [
      {
        plugin: JustValidatePluginDate(() => ({
          format: 'dd MMM yyyy',
        })),
        errorMessage: 'Date should be in dd MMM yyyy format (e.g. 20 Dec 2021)',
      },
    ])
    .onSuccess((ev) => {
      ev?.preventDefault();
      window.showNotification();
    });
};

const dateDateInput = (): void => {
  const validation = new JustValidate('#date-date-input-form', {
    errorFieldCssClass: 'is-invalid',
    errorLabelStyle: {
      fontSize: '14px',
      color: '#dc3545',
    },
    focusInvalidField: true,
    lockForm: true,
  });

  validation
    .addField('#example9_between_date', [
      {
        plugin: JustValidatePluginDate(() => ({
          required: true,
          isAfter: (
            document.querySelector('#example9_start_date') as HTMLInputElement
          ).value,
          isBefore: (
            document.querySelector('#example9_end_date') as HTMLInputElement
          ).value,
        })),
        errorMessage: 'Date should be between start and end dates',
      },
    ])
    .addField('#example9_between_not_required_date', [
      {
        plugin: JustValidatePluginDate(() => ({
          isAfter: (
            document.querySelector('#example9_start_date') as HTMLInputElement
          ).value,
          isBefore: (
            document.querySelector('#example9_end_date') as HTMLInputElement
          ).value,
        })),
        errorMessage: 'Date should be between start and end dates',
      },
    ])
    .onSuccess((ev) => {
      ev?.preventDefault();
      window.showNotification();
    });
};

const successLabel = (): void => {
  const validation = new JustValidate('#success-label-form', {
    errorFieldCssClass: 'is-invalid',
    errorLabelStyle: {
      fontSize: '14px',
      color: '#dc3545',
    },
    successFieldCssClass: 'is-valid',
    successLabelStyle: {
      fontSize: '14px',
      color: '#20b418',
    },
    focusInvalidField: true,
    lockForm: true,
  });

  validation
    .addField(
      '#example10_name',
      [
        {
          rule: 'required' as Rules,
        },
      ],
      {
        successMessage: 'Looks good!',
      }
    )
    .onSuccess((ev) => {
      ev?.preventDefault();
      window.showNotification();
    });
};

const errorsContainer = (): void => {
  const validation = new JustValidate('#errors-container-form', {
    errorFieldCssClass: 'is-invalid',
    errorLabelStyle: {
      fontSize: '14px',
      color: '#dc3545',
    },
    focusInvalidField: true,
    lockForm: true,
    errorsContainer: '#example11_errors-container',
  });

  validation
    .addField('#example11_name', [
      {
        rule: 'required' as Rules,
        errorMessage: 'Name is required',
      },
    ])
    .addField('#example11_email', [
      {
        rule: 'required' as Rules,
        errorMessage: 'Email is required',
      },
    ])
    .addField('#example11_password', [
      {
        rule: 'required' as Rules,
        errorMessage: 'Password is required',
      },
    ])
    .addField('#example11_age', [
      {
        rule: 'required' as Rules,
        errorMessage: 'Age is required',
      },
    ])
    .addRequiredGroup(
      '#example11_read_terms_checkbox_group',
      'You should select at least one communication channel',
      {
        errorsContainer: '#example11_group-errors-container',
      }
    )
    .onSuccess((ev) => {
      ev?.preventDefault();
      window.showNotification();
    });
};

const showMessages = (): void => {
  const validation = new JustValidate('#show-errors-form', {
    errorFieldCssClass: 'is-invalid',
    errorLabelStyle: {
      fontSize: '14px',
      color: '#dc3545',
    },
    successFieldCssClass: 'is-valid',
    successLabelStyle: {
      fontSize: '14px',
      color: '#20b418',
    },
    focusInvalidField: true,
    lockForm: true,
  });

  document
    .querySelector('#example12_error-btn')
    ?.addEventListener('click', () => {
      validation.showErrors({
        '#example12_name': 'The email is invalid!',
      });
    });

  document
    .querySelector('#example12_success-btn')
    ?.addEventListener('click', () => {
      validation.showSuccessLabels({
        '#example12_name': 'The email looks good!',
      });
    });

  validation
    .addField('#example12_name', [
      {
        rule: 'required' as Rules,
      },
    ])
    .onSuccess((ev) => {
      ev?.preventDefault();
    });
};

basic();
advanced();
async();
tooltips();
localization();
conditional();
files();
dateTextInput();
dateDateInput();
successLabel();
errorsContainer();
showMessages();
