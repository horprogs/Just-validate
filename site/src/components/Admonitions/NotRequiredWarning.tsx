import React from 'react';
import Admonition from '@theme/Admonition';

const NotRequiredWarning = () => {
  return (
    <Admonition type="caution">
      <p>
        Please note, the rule doesn't trigger the validation error if the field
        is empty. If you want to make it required you should also add{' '}
        <code>required</code> rule
      </p>
    </Admonition>
  );
};

export default NotRequiredWarning;
