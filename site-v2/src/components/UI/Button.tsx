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
  use = 'button',
  ...props
}: Props) => {
  const commonProps = {
    type,
    className: 'button',
    onClick,
    'data-variant': variant,
    ...props,
  };
  return (
    <div className="control-wrapper">
      {use === 'a' ? (
        <a {...commonProps}>{children}</a>
      ) : (
        <button {...commonProps}>{children}</button>
      )}
    </div>
  );
};

export default Button;
