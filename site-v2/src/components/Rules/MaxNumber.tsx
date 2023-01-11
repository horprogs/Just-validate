import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';

const MaxNumber = () => {
  return (
    <Form
      init={(onSuccess) => {
        const validator = new JustValidate('#form');

        validator
          .addField('#number', [
            {
              rule: Rules.MaxNumber,
              value: 100,
            },
          ])
          .onSuccess(onSuccess);
      }}
    >
      <Input
        id="number"
        placeholder="Enter any number"
        label="Maximum number"
      />
    </Form>
  );
};

export default MaxNumber;
