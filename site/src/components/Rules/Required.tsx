import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';

const Required = () => {
  return (
    <Form
      init={(onSuccess) => {
        const validator = new JustValidate('#form');

        validator
          .addField('#name', [
            {
              rule: Rules.Required,
            },
          ])
          .onSuccess(onSuccess);
      }}
    >
      <Input id="name" placeholder="Enter your name" label="Name" />
    </Form>
  );
};

export default Required;
