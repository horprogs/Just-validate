import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';

const BeforeSubmitExample = () => {
  return (
    <Form
      id="submit-automatically_form"
      init={(onSuccess) => {
        const validator = new JustValidate('#submit-automatically_form', {
          submitFormAutomatically: true,
        });

        validator.addField('#submit-automatically_email', [
          {
            rule: 'required' as Rules,
          },
          {
            rule: 'email' as Rules,
          },
        ]);
      }}
    >
      <Input
        id="submit-automatically_email"
        label="Email"
        placeholder="Start typing..."
      />
    </Form>
  );
};

export default BeforeSubmitExample;
