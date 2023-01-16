import React from 'react';
import Button from '@site/src/components/UI/Button';

const Intro = () => {
  return (
    <div className="intro mt-30">
      <div className="intro-left">
        <h1 className="intro-title">JustValidate</h1>
        <div className="intro-text">
          Modern form validation library <br />
          <br />
          Simple, powerful and lightweight (~5kb gzip). Written in Typescript,
          and has no dependencies (no JQuery!).
        </div>
        <div className="mt-30">
          <Button variant="secondary" use="a" href="/examples">
            Check it out
          </Button>
        </div>
      </div>
      <div className="intro-right"></div>
    </div>
  );
};

export default Intro;
