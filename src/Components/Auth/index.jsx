import React from 'react';
import {Switch, Route, useRouteMatch} from 'react-router-dom';

import AuthOnboarding from './AuthOnboarding';
import Phone from './Phone';
import QRCode from './QRCode';

export default function AuthComponent() {
  console.log('at Auth');
  const {url} = useRouteMatch();

  return (
      <Switch>
        <Route exact path={`${url}`}>
          <AuthOnboarding path={url}/>
        </Route>
        <Route path={`${url}/phone`} component={Phone}/>
        <Route path={`${url}/qr`} component={QRCode}/>
      </Switch>
  );
}