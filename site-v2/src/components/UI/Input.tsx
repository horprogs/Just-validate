import React from 'react';

type Props = {
  id: string;
  type?: string;
  placeholder?: string;
  label: string;
  multiple?: boolean;
};

const Input = ({ id, type = 'text', placeholder, label, multiple }: Props) => {
  return (
    <div className="control-wrapper">
      <label className="input-label" htmlFor={id}>
        {label}
      </label>
      <div className="input-wrapper">
        <input
          id={id}
          className="input"
          autoComplete="off"
          type={type}
          placeholder={placeholder}
          multiple={multiple}
        />
      </div>
    </div>
  );
};

export default Input;
