import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';

const Integer = () => {
  return (
    <Form
      init={(onSuccess) => {
        const validator = new JustValidate('#form');

        validator
          .addField('#integer', [
            {
              rule: Rules.Integer,
            },
          ])
          .onSuccess(onSuccess);
      }}
    >
      <Input
        id="integer"
        placeholder="Enter an integer number"
        label="Integer number"
      />
    </Form>
  );
};

export default Integer;
