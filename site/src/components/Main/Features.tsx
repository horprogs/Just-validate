import React from 'react';

const Features = () => {
  return (
    <div className="mt-80">
      <h2 className="title">Features</h2>
      <div className="subtitle">
        It's a right choice for you, if you have a site, a landing page without
        React, JQuery etc. and you want to quick, simple and powerful solution
        for validating your form.
      </div>
      <div className="features mt-30">
        <div className="features-col">
          {[
            'small size and 0 dependencies',
            'conditional validation',
            'wide range of pre-defined rules',
            'custom rules',
            'custom styling',
            'custom messages',
          ].map((item) => (
            <div className="features-item" key={item}>
              {item}
            </div>
          ))}
        </div>
        <div className="features-col">
          <img src="/img/features.png" className="features-img" />
        </div>
        <div className="features-col">
          {[
            'support plugins',
            'support tooltips',
            'custom error containers',
            'localisation',
            'made with Typescript',
            '96% test coverage',
          ].map((item) => (
            <div className="features-item" key={item}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
