import React, { useEffect } from 'react';
import Button from '@site/src/components/UI/Button';
import { toast, ToastContainer } from 'react-toastify';

type Props = {
  children: React.ReactNode;
  init: (onSuccess: () => void) => void;
  id?: string;
};

const Form = ({ children, init, id = 'form' }: Props) => {
  useEffect(() => {
    init(() => {
      toast.success('Success!', {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        theme: 'light',
      });
    });
  }, []);

  return (
    <div className="form-wrapper">
      <form id={id} autoComplete="off">
        {children}

        <Button>Submit</Button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Form;
