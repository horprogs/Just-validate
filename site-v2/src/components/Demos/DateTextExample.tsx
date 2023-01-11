import React, { useRef, useState } from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import JustValidatePluginDate from 'just-validate-plugin-date';
import Input from '@site/src/components/UI/Input';

const DateTextExample = () => {
  const [valid, setValid] = useState(false);
  const validatorRef = useRef<JustValidate>();

  return (
    <Form
      id="date-text_form"
      valid={valid}
      init={() => {
        const validator = new JustValidate('#date-text_form');

        validator
          .addField('#date-text_start_date', [
            {
              plugin: JustValidatePluginDate(() => ({
                format: 'dd/MM/yyyy',
              })),
              errorMessage:
                'Date should be in dd/MM/yyyy format (e.g. 20/12/2021)',
            },
          ])
          .addField('#date-text_between_date', [
            {
              plugin: JustValidatePluginDate(() => ({
                format: 'dd/MM/yyyy',
              })),
              errorMessage:
                'Date should be in dd/MM/yyyy format (e.g. 20/12/2021)',
            },
            {
              plugin: JustValidatePluginDate((fields) => {
                return {
                  format: 'dd/MM/yyyy',
                  isAfter: fields['#date-text_start_date'].elem.value,
                  isBefore: fields['#date-text_end_date'].elem.value,
                }
              }),
              errorMessage: 'Date should be between start and end dates',
            },
          ])
          .addField('#date-text_end_date', [
            {
              plugin: JustValidatePluginDate(() => ({
                format: 'dd/MM/yyyy',
              })),
              errorMessage:
                'Date should be in dd/MM/yyyy format (e.g. 20/12/2021)',
            },
          ])
          .addField('#date-text_format', [
            {
              plugin: JustValidatePluginDate(() => ({
                format: 'dd MMM yyyy',
              })),
              errorMessage:
                'Date should be in dd MMM yyyy format (e.g. 20 Dec 2021)',
            },
          ])
          .onSuccess(() => {
            setValid(true);
          })
          .onFail(() => {
            setValid(false);
          });

        validatorRef.current = validator;
      }}
    >
      <div className="control-wrapper">
        <Input
          id="date-text_start_date"
          label="Start date"
          placeholder="Enter start date"
        />
      </div>
      <div className="control-wrapper">
        <Input
          id="date-text_between_date"
          label="Between date"
          placeholder="Enter between date"
        />
      </div>
      <div className="control-wrapper">
        <Input
          id="date-text_end_date"
          label="End date"
          placeholder="Enter end date"
        />
      </div>
      <div className="control-wrapper">
        <Input
          id="date-text_format"
          label="Check for dd MMM yyyy format"
          placeholder="Enter a valid date"
        />
      </div>
    </Form>
  );
};

export default DateTextExample;
