import React, { useState } from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';

const BasicExample = () => {
  return (
    <Form
      id="basic_form"
      init={(onSuccess) => {
        const validator = new JustValidate('#basic_form');

        validator
          .addField('#basic_name', [
            {
              rule: 'required',
            },
            {
              rule: 'minLength',
              value: 3,
            },
            {
              rule: 'maxLength',
              value: 15,
            },
          ])
          .addField('#basic_email', [
            {
              rule: 'required',
            },
            {
              rule: 'email',
            },
          ])
          .addField('#basic_password', [
            {
              rule: 'required',
            },
            {
              rule: 'password',
            },
          ])
          .addField('#basic_age', [
            {
              rule: 'required',
            },
            {
              rule: 'number',
            },
            {
              rule: 'minNumber',
              value: 18,
            },
            {
              rule: 'maxNumber',
              value: 150,
            },
          ])
          .onSuccess(onSuccess);
      }}
    >
      <div className="row">
        <div className="col">
          <Input id="basic_name" label="Name" placeholder="Enter your name" />
        </div>

        <div className="col">
          <Input
            id="basic_email"
            label="Email"
            placeholder="Enter your email"
          />
        </div>
      </div>
      <Input
        id="basic_password"
        label="Password"
        placeholder="Enter your password"
      />
      <Input id="basic_age" label="Age" placeholder="Enter your age" />
    </Form>
  );
};

export default BasicExample;
