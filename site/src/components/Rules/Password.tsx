import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';

const Password = () => {
  return (
    <Form
      init={(onSuccess) => {
        const validator = new JustValidate('#form');

        validator
          .addField('#password', [
            {
              rule: Rules.Password,
            },
          ])
          .onSuccess(onSuccess);
      }}
    >
      <Input id="password" placeholder="Enter password" label="Password" />
    </Form>
  );
};

export default Password;
