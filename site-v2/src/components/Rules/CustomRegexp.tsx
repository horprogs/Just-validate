import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';
import { defaultJustValidateConfig } from '@site/src/utils';

const CustomRegexp = () => {
  return (
    <Form
      init={() => {
        const validator = new JustValidate('#form', defaultJustValidateConfig);

        validator.addField('#regexp', [
          {
            rule: Rules.CustomRegexp,
            value: /[a-z]/gi,
          },
        ]);
      }}
    >
      <Input
        id="regexp"
        placeholder="Enter any letters (/[a-z]/gi regexp)"
        label="CustomRegexp"
      />
    </Form>
  );
};

export default CustomRegexp;
