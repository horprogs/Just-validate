import React from 'react';

type Props = {
  id: string;
  label: string;
  name?: string;
};

const Checkbox = ({ id, label, name }: Props) => {
  return (
    <div className="control-wrapper">
      <div className="flex">
        <input type="checkbox" id={id} className="checkbox" name={name} />
        <label className="input-label ml-8 pb-0" htmlFor={id}>
          {label}
        </label>
      </div>
      <div id={`${id}-errors-container`} />
    </div>
  );
};

export default Checkbox;
