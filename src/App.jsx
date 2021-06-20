import React, {useEffect, useState} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import ApplicationStore from './Utils/ApplicationStore';
import Loading from './Components/Loading';
import TdLibController from './Utils/TdLibController';

const AuthComponent = React.lazy(() => import('./Components/Auth/Auth'));

function Main() {
  console.log('at Main');
  return (
      <div className="ui-page ui-page-active">
        <div className="ui-content ">
          Main chat list
        </div>
      </div>
  );
}

export default function App() {
  console.log('at App');
  let [authState, setAuthState] = useState(
      JSON.parse(localStorage.getItem('auth'))
      ?? {'@type': 'authorizationStateWaitPhoneNumber'},
  );

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

  let page = (
      <>
        <Route path="*">
          <Redirect to="/"/>
        </Route>
        <Route exact path="/" component={Main}/>
      </>
  );
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
    default:
      break;
  }

  return (
      <React.Suspense fallback={Loading}>
        <Switch>
          {page}
        </Switch>
      </React.Suspense>
  );
}