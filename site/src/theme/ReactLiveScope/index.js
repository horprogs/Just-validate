import React, { useEffect } from 'react';
import JustValidate from 'just-validate';

const onLoad = (callback) => {
  useEffect(() => {
    callback();
  }, []);
};
// Add react-live imports you need here
const ReactLiveScope = {
  React,
  JustValidate,
  onLoad,
  ...React,
};
export default ReactLiveScope;
