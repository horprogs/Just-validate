import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';
import { defaultJustValidateConfig } from '@site/src/utils';

const Number = () => {
  return (
    <Form
      init={() => {
        const validator = new JustValidate('#form', defaultJustValidateConfig);

        validator.addField('#number', [
          {
            rule: Rules.Number,
          },
        ]);
      }}
    >
      <Input id="number" placeholder="Enter any number" label="Number" />
    </Form>
  );
};

export default Number;
