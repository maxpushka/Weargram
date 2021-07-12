import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router} from 'react-router-dom';
import './tau/wearable/theme/default/tau.min.css';
import './tau/wearable/theme/default/tau.circle.min.css';
import './tau/wearable/js/tau.min.js';
import './System';
import App from './App';

ReactDOM.render(
    <React.StrictMode>
      <Router>
        <App/>
      </Router>
      <div style={{
        width: '360px',
        height: '360px',
        border: '2px solid #fff',
        borderRadius: '50%',
        position: 'fixed',
        zIndex: '1000000',
        pointerEvents: 'none',
      }}/>
    </React.StrictMode>,
    document.getElementById('root'),
);
