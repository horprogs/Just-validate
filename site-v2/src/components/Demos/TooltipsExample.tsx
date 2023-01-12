import React from 'react';
import Form from '../Form/Form';
import JustValidate, { Rules } from 'just-validate';
import Input from '@site/src/components/UI/Input';
import Select from '@site/src/components/UI/Select';
import Checkbox from '@site/src/components/UI/Checkbox';
import Radio from '@site/src/components/UI/Radio';

const TooltipsExample = () => {
  return (
    <Form
      id="tooltips_form"
      init={(onSuccess) => {
        const validator = new JustValidate('#tooltips_form', {
          tooltip: {
            position: 'top',
          },
        });

        validator
          .addField('#tooltips_name', [
            {
              rule: 'required' as Rules,
            },
          ])
          .addField('#tooltips_email', [
            {
              rule: 'required' as Rules,
            },
            {
              rule: 'email' as Rules,
            },
          ])
          .addField(
            '#tooltips_consent_checkbox',
            [
              {
                rule: 'required' as Rules,
              },
            ],
            {
              errorsContainer: '#tooltips_consent_checkbox-errors-container',
            }
          )
          .addField(
            '#tooltips_favorite_animal_select',
            [
              {
                rule: 'required' as Rules,
              },
            ],
            {
              tooltip: {
                position: 'right',
              },
            }
          )
          .addRequiredGroup(
            '#tooltips_communication_checkbox_group',
            'You should select at least one communication channel',
            {
              tooltip: {
                position: 'bottom',
              },
            }
          )
          .addRequiredGroup('#tooltips_communication_radio_group', undefined, {
            tooltip: {
              position: 'bottom',
            },
          })
          .onSuccess(onSuccess);
      }}
    >
      <div className="row">
        <div className="col">
          <Input
            id="tooltips_name"
            label="Name"
            placeholder="Enter your name"
          />
        </div>

        <div className="col">
          <Input
            id="tooltips_email"
            label="Email"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <Select
        id="tooltips_favorite_animal_select"
        label="Select you favorite animal"
      />
      <div className="control-wrapper mb-32">
        <div className="label mb-8">Please confirm you agree</div>
        <Checkbox
          id="tooltips_consent_checkbox"
          label="I agree to provide the information"
        />
      </div>

      <div
        className="control-wrapper mb-32"
        id="tooltips_communication_checkbox_group"
      >
        <div className="label mb-8">Please select at least 1 option</div>
        <Checkbox
          id="tooltips_communication_checkbox_group_1"
          label="I'd like to receive news by email"
          name="communication_checkbox_group"
        />
        <Checkbox
          id="tooltips_communication_checkbox_group_2"
          label="I'd like to receive news by post"
          name="communication_checkbox_group"
        />
        <Checkbox
          id="tooltips_communication_checkbox_group_3"
          label="I'd like to receive news by text phone"
          name="communication_checkbox_group"
        />
      </div>

      <div className="control-wrapper mb-16">
        <div className="label mb-8">
          Please select your preferred contact method
        </div>
        <div id="tooltips_communication_radio_group">
          <Radio
            id="tooltips_communication_radio_group_1"
            label="Email"
            name="communication_radio_group"
          />
          <Radio
            id="tooltips_communication_radio_group_2"
            label="Text message"
            name="communication_radio_group"
          />
        </div>
      </div>
    </Form>
  );
};

export default TooltipsExample;
