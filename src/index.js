import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router} from "react-router-dom";
import './tau/wearable/theme/default/tau.min.css';
import './tau/wearable/theme/default/tau.circle.min.css';
import './tau/wearable/js/tau.min.js';
import './System';
import App from './App';

ReactDOM.render(
    <Router>
        <App/>
    </Router>,
    document.getElementById('root')
);
