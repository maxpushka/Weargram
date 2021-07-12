import React, {useEffect, useState} from 'react';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';
import TdLibController from './Stores/TdLibController';
import ApplicationStore from './Stores/ApplicationStore';
import LoadingPage from './Components/Loaders/LoadingPage';

const MainPage = React.lazy(async () => await import('./Components/MainPage'));
const AuthComponent = React.lazy(async () => await import('./Components/Auth/Auth'));

export default function App() {
  console.log('[App]');
  let [authState, setAuthState] = useState(
      () => JSON.parse(localStorage.getItem('auth')) ?? {'@type': 'authorizationStateWaitPhoneNumber'},
  );
  const {url} = useRouteMatch();

  useEffect(() => {
    TdLibController.init();
    ApplicationStore.on('updateAuthorizationState', onUpdateAuthorizationState);

    return function() {
      ApplicationStore.off('updateAuthorizationState', onUpdateAuthorizationState);
    };
  }, []);

  function onUpdateAuthorizationState(update) {
    let newState = update['authorization_state'];

    if (newState['@type'] === 'authorizationStateClosed' ||
        newState['@type'] === 'authorizationStateClosing' ||
        newState['@type'] === 'authorizationStateWaitEncryptionKey' ||
        newState['@type'] === 'authorizationStateWaitTdlibParameters') {
      return;
    }

    localStorage.setItem('auth', JSON.stringify(newState));
    setAuthState(newState);

    TdLibController.send({
      '@type': 'setOption',
      name: 'online',
      value: {'@type': 'optionValueBoolean', value: true},
    });
  }

  let page;
  switch (authState['@type']) {
    case 'authorizationStateWaitOtherDeviceConfirmation':
    case 'authorizationStateWaitCode':
    case 'authorizationStateWaitRegistration':
    case 'authorizationStateWaitPassword':
    case 'authorizationStateWaitPhoneNumber':
    case 'authorizationStateWaitTdlib': {
      const path = '/login';
      page = (
          <>
            <Route exact path="/">
              <Redirect to={path}/>
            </Route>
            <Route path={path} component={AuthComponent}/>
          </>
      );
      break;
    }
    case 'authorizationStateLoggingOut': {
      page = <LoadingPage/>;
      break;
    }
    default: {
      page = (
          <>
            <Route path="*">
              <Redirect to="/"/>
            </Route>
            <Route exact path="/" component={MainPage}/>
          </>
      );
      break;
    }
  }

  return (
      <React.Suspense fallback={<LoadingPage/>}>
        <Switch>
          {page}
        </Switch>
      </React.Suspense>
  );
}

// todo: store sensitive app data (including api id, api hash and tdlib encryption key) in hardware security module
// todo: move public/icons to src/icons
// todo: add prop-types throughout the project where necessary
