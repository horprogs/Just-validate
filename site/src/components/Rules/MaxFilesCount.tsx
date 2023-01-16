import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';

const MaxFilesCount = () => {
  return (
    <Form
      init={(onSuccess) => {
        const validator = new JustValidate('#form');

        validator
          .addField('#files', [
            {
              rule: Rules.MaxFilesCount,
              value: 2,
            },
          ])
          .onSuccess(onSuccess);
      }}
    >
      <Input id="files" type="file" label="Upload at max 2 files" />
    </Form>
  );
};

export default MaxFilesCount;
