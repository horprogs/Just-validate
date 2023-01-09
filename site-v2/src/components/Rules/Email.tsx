import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';
import { defaultJustValidateConfig } from '@site/src/utils';

const Email = () => {
  return (
    <Form
      init={() => {
        const validator = new JustValidate('#form', defaultJustValidateConfig);

        validator.addField('#email', [
          {
            rule: Rules.Email,
          },
        ]);
      }}
    >
      <Input id="email" placeholder="Enter email" label="Email" />
    </Form>
  );
};

export default Email;
