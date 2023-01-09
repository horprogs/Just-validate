import React from 'react';

type Props = {
  id: string;
  label: string;
};

const Input = ({ id, label }: Props) => {
  return (
    <div className="control-wrapper">
      <label className="input-label" htmlFor={id}>
        {label}
      </label>
      <div className="input-wrapper">
          <select className="select minimal" id={id}>
              <option value="">--Please choose an option--</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="hamster">Hamster</option>
              <option value="parrot">Parrot</option>
              <option value="spider">Spider</option>
              <option value="goldfish">Goldfish</option>
          </select>
      </div>
    </div>
  );
};

export default Input;
