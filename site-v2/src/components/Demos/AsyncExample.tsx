import React, { useState } from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';

const AsyncExample = () => {
  return (
    <Form
      id="async_form"
      init={(onSuccess) => {
        const validator = new JustValidate('#async_form');

        validator
          .addField('#async_email', [
            {
              rule: 'required',
            },
            {
              validator: (value) => () =>
                new Promise((resolve) => {
                  setTimeout(() => {
                    resolve(false);
                  }, 1000);
                }),
              errorMessage: 'Email already exists!',
            },
          ])
          .onSuccess(onSuccess);
      }}
    >
      <Input id="async_email" label="Email" placeholder="Enter your email" />
    </Form>
  );
};

export default AsyncExample;
