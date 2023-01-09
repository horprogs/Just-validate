import React, { useState } from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';
import { defaultJustValidateConfig } from '@site/src/utils';

const QuickStart = () => {
  const [valid, setValid] = useState(false);

  return (
    <Form
      id="quick-start_form"
      valid={valid}
      init={() => {
        const validator = new JustValidate(
          '#quick-start_form',
          defaultJustValidateConfig
        );

        validator
          .addField('#quick-start_name', [
            {
              rule: Rules.Required,
            },
            {
              rule: Rules.MinLength,
              value: 3,
            },
            {
              rule: Rules.MaxLength,
              value: 30,
            },
          ])
          .addField('#quick-start_email', [
            {
              rule: Rules.Required,
              errorMessage: 'Email is required',
            },
            {
              rule: Rules.Email,
              errorMessage: 'Email is invalid!',
            },
          ])
          .onSuccess(() => {
            setValid(true);
          })
          .onFail(() => {
            setValid(false);
          });
      }}
    >
      <Input id="quick-start_name" placeholder="Enter name" label="Name" />
      <Input id="quick-start_email" placeholder="Enter email" label="Email" />
    </Form>
  );
};

export default QuickStart;
