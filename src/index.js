import React from 'react';
import ReactDOM from 'react-dom';

import './tau/wearable/theme/default/tau.min.css';
import './tau/wearable/theme/default/tau.circle.min.css';
import './tau/wearable/js/tau.min.js';

import './system/low-battery-check.js';
import './system/circle-helper.js';
import './system/back-key.js';

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);