import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';
import { defaultJustValidateConfig } from '@site/src/utils';

const MinNumber = () => {
  return (
    <Form
      init={() => {
        const validator = new JustValidate('#form', defaultJustValidateConfig);

        validator.addField('#number', [
          {
            rule: Rules.MinNumber,
            value: 5,
          },
        ]);
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
