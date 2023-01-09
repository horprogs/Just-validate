import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';
import { defaultJustValidateConfig } from '@site/src/utils';

const StrongPassword = () => {
  return (
    <Form
      init={() => {
        const validator = new JustValidate('#form', defaultJustValidateConfig);

        validator.addField('#password', [
          {
            rule: Rules.StrongPassword,
          },
        ]);
      }}
    >
      <Input id="password" placeholder="Enter password" label="Password" />
    </Form>
  );
};

export default StrongPassword;
