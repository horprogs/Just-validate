import React, { useRef } from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';
import Select from '@site/src/components/UI/Select';

const LocalisationExample = () => {
  const validatorRef = useRef<JustValidate>();

  return (
    <Form
      id="localisation_form"
      init={(onSuccess) => {
        const validator = new JustValidate('#localisation_form', undefined, [
          {
            key: 'Name is required',
            dict: {
              Spanish: 'Se requiere el nombre',
              French: 'Le nom est requis',
            },
          },
          {
            key: 'Name is too short',
            dict: {
              Spanish: 'El nombre es muy corto',
              French: 'Le nom est trop court',
            },
          },
          {
            key: 'Name is too long',
            dict: {
              Spanish: 'El nombre es demasiado largo',
              French: 'Le nom est trop long',
            },
          },
          {
            key: 'Email is required',
            dict: {
              Spanish: 'Correo electronico es requerido',
              French: "L'e-mail est requis",
            },
          },
          {
            key: 'Email is invalid',
            dict: {
              Spanish: 'El correo electrónico es invalido',
              French: 'Le courriel est invalide',
            },
          },
        ]);

        validator
          .addField('#localisation_form_name', [
            {
              rule: 'required' as Rules,
              errorMessage: 'Name is required',
            },
            {
              rule: 'minLength' as Rules,
              value: 3,
              errorMessage: 'Name is too short',
            },
            {
              rule: 'maxLength' as Rules,
              value: 15,
              errorMessage: 'Name is too long',
            },
          ])
          .addField('#localisation_form_email', [
            {
              rule: 'required' as Rules,
              errorMessage: 'Email is required',
            },
            {
              rule: 'email' as Rules,
              errorMessage: 'Email is invalid',
            },
          ])
          .onSuccess(onSuccess);

        validator.setCurrentLocale('English');

        validatorRef.current = validator;
      }}
    >
      <div>
        <Select
          id="localisation_language"
          label="Change error messages language"
          options={[
            {
              label: 'English',
            },
            {
              label: 'Spanish',
            },
            {
              label: 'French',
            },
          ]}
          defaultValue="English"
          onChange={(val) => {
            validatorRef.current?.setCurrentLocale(val);
          }}
        />
      </div>
      <div className="row">
        <div className="col">
          <Input
            id="localisation_form_name"
            label="Name"
            placeholder="Enter your name"
          />
        </div>

        <div className="col">
          <Input
            id="localisation_form_email"
            label="Email"
            placeholder="Enter your email"
          />
        </div>
      </div>
    </Form>
  );
};

export default LocalisationExample;
