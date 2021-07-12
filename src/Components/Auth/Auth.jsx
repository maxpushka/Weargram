import React from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import AuthOnboarding from './AuthOnboarding';

const Phone = React.lazy(async () => await import('./Phone'));
const QRCode = React.lazy(async () => await import('./QRCode'));
const Password = React.lazy(async () => await import('./Password'));
const Unregistered = React.lazy(async () => await import('./Unregistered'));

export const routesContext = React.createContext();

export default function AuthComponent() {
  console.log('[Auth]');
  const {url} = useRouteMatch();
  const routes = {
    phone: `${url}/phone`,
    qr: `${url}/qr`,
    password: `${url}/pass`,
    unregistered: `${url}/unreg`,
    success: '/',
  };

  return (
      <Switch>
        <Route exact path={`${url}`}>
          <AuthOnboarding path={url}/>
        </Route>
        <Route path={routes.phone}>
          <routesContext.Provider
              value={{
                success: routes.success,
                unregistered: routes.unregistered,
                password: routes.password,
              }}>
            <Phone/>
          </routesContext.Provider>
        </Route>
        <Route path={routes.qr}>
          <QRCode passwordPath={routes.password}/>
        </Route>
        <Route path={routes.password} component={Password}/>
        <Route path={routes.unregistered} component={Unregistered}/>
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
    default:
      return false;
  }
}
