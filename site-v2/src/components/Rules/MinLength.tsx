import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';
import { defaultJustValidateConfig } from '@site/src/utils';

const MinLength = () => {
  return (
    <Form
      init={() => {
        const validator = new JustValidate('#form', defaultJustValidateConfig);

        validator.addField('#name', [
          {
            rule: Rules.MinLength,
            value: 3,
          },
        ]);
      }}
    >
      <Input id="name" placeholder="Enter your name" label="Name" />
    </Form>
  );
};

export default MinLength;
