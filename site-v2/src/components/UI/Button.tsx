import React from 'react';

type Props = {
  children: React.ReactNode;
};

const Button = ({ children, ...props }: Props) => {
  return (
    <div className="control-wrapper">
      <button type="submit" className="button" {...props}>
        {children}
      </button>
    </div>
  );
};

export default Button;
