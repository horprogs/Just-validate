import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';
import { defaultJustValidateConfig } from '@site/src/utils';

const MinFilesCount = () => {
  return (
    <Form
      init={() => {
        const validator = new JustValidate('#form', defaultJustValidateConfig);

        validator.addField('#files', [
          {
            rule: Rules.MinFilesCount,
            value: 2,
          },
        ]);
      }}
    >
      <Input id="files" type="file" label="Upload at least 2 files" />
    </Form>
  );
};

export default MinFilesCount;
