import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';
import { defaultJustValidateConfig } from '@site/src/utils';

const MaxFilesCount = () => {
  return (
    <Form
      init={() => {
        const validator = new JustValidate('#form', defaultJustValidateConfig);

        validator.addField('#files', [
          {
            rule: Rules.MaxFilesCount,
            value: 2,
          },
        ]);
      }}
    >
      <Input id="files" type="file" label="Upload at max 2 files" />
    </Form>
  );
};

export default MaxFilesCount;
