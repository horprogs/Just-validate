import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';

const Files = () => {
  return (
    <Form
      init={() => {
        const validator = new JustValidate('#form', {
          errorFieldCssClass: 'is-invalid',
          errorLabelStyle: {
            fontSize: '14px',
            color: '#dc3545',
          },
          focusInvalidField: true,
          lockForm: true,
        });

        validator.addField('#files', [
          {
            rule: Rules.Files,
            value: {
              files: {
                extensions: ['jpeg', 'jpg', 'png'],
                maxSize: 20000,
                minSize: 10000,
                types: ['image/jpeg', 'image/jpg', 'image/png'],
              },
            },
          },
        ]);
      }}
    >
      <Input
        id="files"
        type="file"
        label="Upload jpg/png file, 10kb - 20kb size"
      />
    </Form>
  );
};

export default Files;
