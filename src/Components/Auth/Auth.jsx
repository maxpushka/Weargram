import React from 'react';
import {Switch, Route, useRouteMatch} from 'react-router-dom';
import AuthOnboarding from './AuthOnboarding';

const Phone = React.lazy(() => import('./Phone'));
const QRCode = React.lazy(() => import('./QRCode'));

// todo: handle offline mode
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

export function isConnecting(state) {
  if (!state) return false;

  switch (state['@type']) {
    case 'connectionStateConnecting': {
      return true;
    }
    case 'connectionStateConnectingToProxy': {
      return true;
    }
    case 'connectionStateReady': {
      return false;
    }
    case 'connectionStateUpdating': {
      return false;
    }
    case 'connectionStateWaitingForNetwork': {
      return false;
    }
  }

  return false;
}
