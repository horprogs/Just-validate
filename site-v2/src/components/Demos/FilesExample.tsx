import React, { useRef, useState } from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';

const FilesExample = () => {
  const validatorRef = useRef<JustValidate>();

  return (
    <Form
      id="files_form"
      init={(onSuccess) => {
        const validator = new JustValidate('#files_form');

        validator
          .addField('#files_minmax', [
            {
              rule: 'minFilesCount',
              value: 1,
            },
            {
              rule: 'maxFilesCount',
              value: 3,
            },
          ])
          .addField('#files_png', [
            {
              rule: 'minFilesCount',
              value: 1,
            },
            {
              rule: 'maxFilesCount',
              value: 1,
            },
            {
              rule: 'files',
              value: {
                files: {
                  types: ['image/png'],
                  extensions: ['png'],
                },
              },
            },
          ])
          .addField('#files_attr', [
            {
              rule: 'minFilesCount',
              value: 1,
            },
            {
              rule: 'files',
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

        validatorRef.current = validator;
      }}
    >
      <div className="control-wrapper">
        <Input
          type="file"
          id="files_minmax"
          label="Upload 1-3 files"
          multiple
        />
      </div>
      <div className="control-wrapper">
        <Input type="file" id="files_png" label="Upload 1 png file" />
      </div>
      <div className="control-wrapper">
        <Input
          type="file"
          id="files_attr"
          label="Upload several png/jpg/jpeg files with min size 10kb and max size 25kb"
          multiple
        />
      </div>
    </Form>
  );
};

export default FilesExample;
