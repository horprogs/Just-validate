import React, { useRef } from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';
import Checkbox from '@site/src/components/UI/Checkbox';

const ConditionalExample = () => {
  const validatorRef = useRef<JustValidate>();

  return (
    <Form
      id="conditional_form"
      init={(onSuccess) => {
        const validator = new JustValidate('#conditional_form');

        validator.onSuccess(onSuccess);

        validatorRef.current = validator;
      }}
    >
      <div className="control-wrapper">
        <Input
          id="conditional_name"
          label="Name"
          placeholder="Enter your name"
        />
      </div>
      <div className="control-wrapper">
        <Checkbox
          id="conditional_checkbox"
          label="Name is required"
          onChange={(checked) => {
            if (checked) {
              validatorRef.current.addField('#conditional_name', [
                {
                  rule: 'required' as Rules,
                },
              ]);
            } else {
              validatorRef.current.removeField('#conditional_name');
            }
          }}
        />
      </div>
    </Form>
  );
};

export default ConditionalExample;
