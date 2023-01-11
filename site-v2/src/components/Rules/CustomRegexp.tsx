import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';

const CustomRegexp = () => {
  return (
    <Form
      init={(onSuccess) => {
        const validator = new JustValidate('#form');

        validator
          .addField('#regexp', [
            {
              rule: Rules.CustomRegexp,
              value: /[a-z]/gi,
            },
          ])
          .onSuccess(onSuccess);
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
