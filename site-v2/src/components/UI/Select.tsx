import React from 'react';

type Props = {
  id: string;
  label: string;
  options?: { label: string }[];
  onChange?: (val: string) => void;
  defaultValue?: string;
};

const defaultOptions = [
  {
    label: 'Dog',
  },
  {
    label: 'Cat',
  },
  {
    label: 'Hamster',
  },
  {
    label: 'Parrot',
  },
  {
    label: 'Spider',
  },
  {
    label: 'Goldfish',
  },
];

const Input = ({
  id,
  label,
  options = defaultOptions,
  onChange,
  defaultValue,
}: Props) => {
  return (
    <div className="control-wrapper">
      <label className="input-label" htmlFor={id}>
        {label}
      </label>
      <div className="input-wrapper">
        <select
          className="select minimal"
          id={id}
          onChange={(e) => {
            onChange?.(e.target.value);
          }}
          defaultValue={defaultValue}
        >
          <option value="">--Please select an option--</option>
          {options.map((item) => (
            <option key={item.label} value={item.label}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Input;
