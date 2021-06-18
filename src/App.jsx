import React from 'react';
import {Switch} from 'react-router-dom';
import routes from './Utils/Routes';
import RouteWithSubRoutes from './Components/RouteWithSubRoutes';
import TdLibController from './Utils/TdLibController';

TdLibController.init();

export default function App() {
    return (
        <Switch>
          {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
        </Switch>
    );
}