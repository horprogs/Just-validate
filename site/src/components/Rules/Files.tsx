import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';

const Files = () => {
  return (
    <Form
      init={(onSuccess) => {
        const validator = new JustValidate('#form');

        validator
          .addField('#files', [
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
          ])
          .onSuccess(onSuccess);
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
