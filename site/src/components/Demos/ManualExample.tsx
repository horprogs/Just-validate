import React, { useRef } from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';
import Button from '@site/src/components/UI/Button';

const ManualExample = () => {
  const validatorRef = useRef<JustValidate>();

  return (
    <Form
      id="manual_form"
      init={(onSuccess) => {
        const validator = new JustValidate('#manual_form');

        validator
          .addField('#manual_name', [
            {
              rule: 'required' as Rules,
            },
          ])
          .onSuccess(onSuccess);

        validatorRef.current = validator;
      }}
    >
      <Input id="manual_name" label="Name" placeholder="Enter your name" />

      <div className="control-wrapper">
        <Button
          onClick={() => {
            validatorRef.current.showErrors({
              '#manual_name': 'The field is invalid',
            });
          }}
          variant="negative"
          type="button"
        >
          Show error label
        </Button>
        <Button
          onClick={() => {
            validatorRef.current.showSuccessLabels({
              '#manual_name': 'The field looks good!',
            });
          }}
          variant="success"
          type="button"
        >
          Show success label
        </Button>
      </div>
    </Form>
  );
};

export default ManualExample;
