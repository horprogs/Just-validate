import React from 'react';

type Props = {
  id: string;
  type?: string;
  placeholder?: string;
  label: string;
};

const Input = ({ id, type = 'text', placeholder, label }: Props) => {
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
          />
      </div>
    </div>
  );
};

export default Input;
