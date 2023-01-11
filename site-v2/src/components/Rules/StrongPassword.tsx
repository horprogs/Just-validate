import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';

const StrongPassword = () => {
  return (
    <Form
      init={(onSuccess) => {
        const validator = new JustValidate('#form');

        validator
          .addField('#password', [
            {
              rule: Rules.StrongPassword,
            },
          ])
          .onSuccess(onSuccess);
      }}
    >
      <Input id="password" placeholder="Enter password" label="Password" />
    </Form>
  );
};

export default StrongPassword;
