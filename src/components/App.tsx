import * as React from 'react';
import './style/app.sass';
import { hot } from 'react-hot-loader';

import Test from '../assets/images/test-image.png';

const App = () => {
  return (
    <div>
      <h1>Hello</h1>
      <img src={Test} alt="" />
      <h2>Yes</h2>
    </div>
  );
};

export default hot(module)(App);
