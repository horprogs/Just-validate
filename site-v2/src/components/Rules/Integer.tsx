import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import { defaultJustValidateConfig } from '@site/src/utils';
import Input from '@site/src/components/UI/Input';

const Integer = () => {
  return (
    <Form
      init={() => {
        const validator = new JustValidate('#form', defaultJustValidateConfig);

        validator.addField('#integer', [
          {
            rule: Rules.Integer,
          },
        ]);
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
