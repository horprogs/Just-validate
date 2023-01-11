import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';

const Email = () => {
  return (
    <Form
      init={(onSuccess) => {
        const validator = new JustValidate('#form');

        validator
          .addField('#email', [
            {
              rule: Rules.Email,
            },
          ])
          .onSuccess(onSuccess);
      }}
    >
      <Input id="email" placeholder="Enter email" label="Email" />
    </Form>
  );
};

export default Email;
