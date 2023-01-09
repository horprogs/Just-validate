import React, { useEffect } from 'react';
import Button from '@site/src/components/UI/Button';

type Props = {
  children: React.ReactNode;
  init: () => void;
  id?: string;
  valid?: boolean;
};

const Form = ({ children, init, id = 'form', valid }: Props) => {
  useEffect(() => {
    init();
  }, []);

  return (
    <form id={id} autoComplete="off">
      {children}

      <Button data-valid={valid}>{valid ? 'Success!' : 'Submit'}</Button>
    </form>
  );
};

export default Form;
