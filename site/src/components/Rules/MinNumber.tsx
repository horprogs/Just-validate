import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';

const MinNumber = () => {
  return (
    <Form
      init={(onSuccess) => {
        const validator = new JustValidate('#form');

        validator
          .addField('#number', [
            {
              rule: Rules.MinNumber,
              value: 5,
            },
          ])
          .onSuccess(onSuccess);
      }}
    >
      <Input
        id="number"
        placeholder="Enter any number"
        label="Minimum number"
      />
    </Form>
  );
};

export default MinNumber;
