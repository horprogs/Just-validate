import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';
import { defaultJustValidateConfig } from '@site/src/utils';
import Textarea from '@site/src/components/UI/Textarea';
import Select from '@site/src/components/UI/Select';
import Checkbox from '@site/src/components/UI/Checkbox';
import Radio from '@site/src/components/UI/Radio';

const AdvancedUsage = () => {
  return (
    <Form
      id="advanced-usage_form"
      init={() => {
        const validator = new JustValidate(
          '#advanced-usage_form',
          defaultJustValidateConfig
        );

        validator
          .addField('#advanced-usage_password', [
            {
              rule: 'required' as Rules,
            },
          ])
          .addField('#advanced-usage_repeat-password', [
            {
              rule: 'required' as Rules,
            },
            {
              validator: (value, fields) => {
                if (
                  fields['#advanced-usage_password'] &&
                  fields['#advanced-usage_password'].elem
                ) {
                  const repeatPasswordValue =
                    fields['#advanced-usage_password'].elem.value;

                  return value === repeatPasswordValue;
                }

                return true;
              },
              errorMessage: 'Passwords should be the same',
            },
          ])
          .addField('#advanced-usage_message', [
            {
              validator: (value) => {
                return value !== undefined && (value as string).length > 3;
              },
              errorMessage: 'Message should be more than 3 letters.',
            },
          ])
          .addField(
            '#advanced-usage_consent_checkbox',
            [
              {
                rule: 'required' as Rules,
              },
            ],
            {
              errorsContainer:
                '#advanced-usage_consent_checkbox-errors-container',
            }
          )
          .addField('#advanced-usage_favorite_animal_select', [
            {
              rule: 'required' as Rules,
            },
          ])
          .addRequiredGroup(
            '#advanced-usage_communication_checkbox_group',
            'You should select at least one communication channel'
          )
          .addField('#advanced-usage_input_number', [
            {
              rule: 'required' as Rules,
            },
            {
              rule: 'number' as Rules,
            },
          ])
          .addField('#advanced-usage_input_integer_number', [
            {
              rule: 'required' as Rules,
            },
            {
              rule: 'integer' as Rules,
            },
          ])
          .addField('#advanced-usage_input_number_between', [
            {
              rule: 'required' as Rules,
            },
            {
              rule: 'minNumber' as Rules,
              value: 10,
            },
            {
              rule: 'maxNumber' as Rules,
              value: 20,
            },
          ])
          .addRequiredGroup('#advanced-usage_communication_radio_group')
          .onSuccess((event) => {
            event.preventDefault();
          });
      }}
    >
      <Input
        id="advanced-usage_password"
        placeholder="Enter password"
        label="Password"
        type="password"
      />
      <Input
        id="advanced-usage_repeat-password"
        placeholder="Repeat password"
        label="Repeat password"
        type="password"
      />
      <Textarea
        id="advanced-usage_message"
        placeholder="Enter message"
        label="Message"
      />
      <Select
        id="advanced-usage_favorite_animal_select"
        label="Select you favorite animal"
      />
      <div className="control-wrapper mb-32">
        <div className="label mb-8">You should give us your consent</div>
        <Checkbox
          id="advanced-usage_consent_checkbox"
          label="I agree to provide the information"
        />
      </div>

      <div
        className="control-wrapper mb-32"
        id="advanced-usage_communication_checkbox_group"
      >
        <div className="label mb-8">Please select at least 1 option</div>
        <Checkbox
          id="advanced-usage_communication_checkbox_group_1"
          label="I'd like to receive news by email"
          name="communication_checkbox_group"
        />
        <Checkbox
          id="advanced-usage_communication_checkbox_group_2"
          label="I'd like to receive news by post"
          name="communication_checkbox_group"
        />
        <Checkbox
          id="advanced-usage_communication_checkbox_group_3"
          label="I'd like to receive news by text phone"
          name="communication_checkbox_group"
        />
      </div>

      <div className="control-wrapper mb-16">
        <div className="label mb-8">
          Please select the preferred way for communication
        </div>
        <div id="advanced-usage_communication_radio_group">
          <Radio
            id="advanced-usage_communication_radio_group_1"
            label="Email"
            name="communication_radio_group"
          />
          <Radio
            id="advanced-usage_communication_radio_group_2"
            label="Text message"
            name="communication_radio_group"
          />
        </div>
      </div>

      <Input
        id="advanced-usage_input_number"
        label="Input any number"
        placeholder="Input any number"
      />
      <Input
        id="advanced-usage_input_integer_number"
        label="Input an integer number"
        placeholder="Input an integer number"
      />
      <Input
        id="advanced-usage_input_number_between"
        label="Input a number between 10 and 20"
        placeholder="Input a number between 10 and 20"
      />
    </Form>
  );
};

export default AdvancedUsage;
