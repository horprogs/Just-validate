import React from 'react';

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  type?: 'button' | 'submit' | 'reset';
};

const Button = ({
  children,
  onClick,
  variant,
  type = 'submit',
  ...props
}: Props) => {
  return (
    <div className="control-wrapper">
      <button
        type={type}
        className="button"
        onClick={onClick}
        data-variant={variant}
        {...props}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
