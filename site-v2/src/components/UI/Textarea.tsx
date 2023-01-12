import React from 'react';

type Props = {
  id: string;
  placeholder?: string;
  label: string;
};

const Textarea = ({ id, placeholder, label }: Props) => {
  return (
    <div className="control-wrapper">
      <label className="input-label" htmlFor={id}>
        {label}
      </label>
      <div className="input-wrapper">
        <textarea
          id={id}
          className="input textarea"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default Textarea;
