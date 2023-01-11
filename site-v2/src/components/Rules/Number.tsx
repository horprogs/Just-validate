import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';

const Number = () => {
  return (
    <Form
      init={(onSuccess) => {
        const validator = new JustValidate('#form');

        validator
          .addField('#number', [
            {
              rule: Rules.Number,
            },
          ])
          .onSuccess(onSuccess);
      }}
    >
      <Input id="number" placeholder="Enter any number" label="Number" />
    </Form>
  );
};

export default Number;
