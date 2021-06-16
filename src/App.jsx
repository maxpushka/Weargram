import React, {Component} from 'react';
import {Switch} from 'react-router-dom';
import routes from './Utils/Routes';
import RouteWithSubRoutes from './Components/RouteWithSubRoutes';
import TdLibController from './Utils/TdLibController';
import AppStore from './Utils/ApplicationStore';

export default class App extends Component {
  constructor() {
    super();
    TdLibController.init();
  }

  render() {
    // setTimeout(() => {
    //   TdLibController.send({'@type': 'getAuthorizationState'}).then(state => {
    //     console.log('state', state);
    //     AppStore.emit('update', state);
    //   }).catch(error => console.log('AAA', error));
    // }, 3000);

    return (
        <Switch>
          {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
        </Switch>
    );
  }
}