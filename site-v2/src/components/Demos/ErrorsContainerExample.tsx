import React, { useState } from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';
import Checkbox from '@site/src/components/UI/Checkbox';
import Radio from '@site/src/components/UI/Radio';

const ErrorsContainerExample = () => {
  return (
    <Form
      id="errors-container_form"
      init={(onSuccess) => {
        const validator = new JustValidate('#errors-container_form', {
          errorsContainer: '#errors-container_custom-container',
        });

        validator
          .addField(
            '#errors-container_name',
            [
              {
                rule: 'required',
              },
            ],
            {
              errorsContainer: '#errors-container_custom-name',
            }
          )
          .addField('#errors-container_email', [
            {
              rule: 'required',
            },
            {
              rule: 'email',
            },
          ])
          .addRequiredGroup(
            '#errors-container_communication_checkbox_group',
            'You should select at least one communication channel',
            {
              tooltip: {
                position: 'bottom',
              },
            }
          )
          .addRequiredGroup(
            '#errors-container_communication_radio_group',
            undefined,
            {
              tooltip: {
                position: 'bottom',
              },
            }
          )
          .onSuccess(onSuccess);
      }}
    >
      <div className="row">
        <div className="col">
          <Input
            id="errors-container_name"
            label="Name"
            placeholder="Enter your name"
          />
          <div className="control-wrapper">
            <span>Custom container for Name field</span>
            <div id="errors-container_custom-name"></div>
          </div>
        </div>

        <div className="col">
          <Input
            id="errors-container_email"
            label="Email"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div
        className="control-wrapper mb-32"
        id="errors-container_communication_checkbox_group"
      >
        <div className="label mb-8">Please select at least 1 option</div>
        <Checkbox
          id="errors-container_communication_checkbox_group_1"
          label="I'd like to receive news by email"
          name="communication_checkbox_group"
        />
        <Checkbox
          id="errors-container_communication_checkbox_group_2"
          label="I'd like to receive news by post"
          name="communication_checkbox_group"
        />
        <Checkbox
          id="errors-container_communication_checkbox_group_3"
          label="I'd like to receive news by text phone"
          name="communication_checkbox_group"
        />
      </div>

      <div className="control-wrapper mb-16">
        <div className="label mb-8">
          Please select your preferred contact method
        </div>
        <div id="errors-container_communication_radio_group">
          <Radio
            id="errors-container_communication_radio_group_1"
            label="Email"
            name="communication_radio_group"
          />
          <Radio
            id="errors-container_communication_radio_group_2"
            label="Text message"
            name="communication_radio_group"
          />
        </div>
      </div>
      <div
        className="control-wrapper"
        id="errors-container_custom-container"
      ></div>
    </Form>
  );
};

export default ErrorsContainerExample;
