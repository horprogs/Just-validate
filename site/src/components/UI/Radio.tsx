import React from 'react';

type Props = {
  id: string;
  label: string;
  name?: string;
};

const Radio = ({ id, label, name }: Props) => {
  return (
    <div className="control-wrapper">
      <label className="input-label flex">
        <input type="radio" id={id} className="radio" name={name} />{' '}
        <span className="ml-8">{label}</span>
      </label>
    </div>
  );
};

export default Radio;
