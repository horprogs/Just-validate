import React from 'react';
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
              rule: 'required' as Rules,
            },
            {
              rule: 'minLength' as Rules,
              value: 3,
            },
            {
              rule: 'maxLength' as Rules,
              value: 15,
            },
          ])
          .addField('#basic_email', [
            {
              rule: 'required' as Rules,
            },
            {
              rule: 'email' as Rules,
            },
          ])
          .addField('#basic_password', [
            {
              rule: 'required' as Rules,
            },
            {
              rule: 'password' as Rules,
            },
          ])
          .addField('#basic_age', [
            {
              rule: 'required' as Rules,
            },
            {
              rule: 'number' as Rules,
            },
            {
              rule: 'minNumber' as Rules,
              value: 18,
            },
            {
              rule: 'maxNumber' as Rules,
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
