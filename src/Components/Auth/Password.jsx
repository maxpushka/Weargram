import React, {useEffect, useRef, useState} from 'react';
import TizenPage from '../TizenPage';
import TdLibController from '../../Utils/TdLibController';
import {Redirect} from 'react-router-dom';
import ApplicationStore from '../../Utils/ApplicationStore';
import {isConnecting} from './Auth';
import './Auth.css';

// todo: Password
export default function Password() {
  const [password, setPassword] = useState('');
  const [badPassword, setBadPassword] = useState({'state': false, 'errorString': ''});
  const [connecting, setConnecting] = useState(() => {
    const state = ApplicationStore.getConnectionState()?.state;
    return isConnecting(state);
  });
  const [isSuccess, setSuccess] = useState(false);
  const inputEl = useRef(null);
  const passwordHint = useRef('');

  useEffect(() => {
    console.log('setting up Password listeners');
    ApplicationStore.on('updateConnectionState', onUpdateConnectionState);

    passwordHint.current = ApplicationStore.getAuthorizationState()?.['password_hint'];
    return function() {
      console.log('removing Password listeners');
      ApplicationStore.off('updateConnectionState', onUpdateConnectionState);
    };
  }, []);

  useEffect(() => {
    badPassword.state ?
        inputEl.current.classList.add('bad-input') :
        inputEl.current.classList.remove('bad-input');
  }, [badPassword]);

  function onUpdateConnectionState(update) {
    const {state} = update;
    setConnecting(isConnecting(state));
  }

  function handleNext() {
    const password = inputEl.current.value;
    if (password) {
      handleDone(password);
    } else {
      setBadPassword({state: true, errorString: 'Invalid password. Please try again.'});
    }
  }

  function handleDone(password) {
    TdLibController.send({
      '@type': 'checkAuthenticationPassword',
      'password': password,
    }).then(result => {
      console.log('password is successfully confirmed', result);
      setSuccess(true);
    }).catch(error => {
      let errorString;
      if (error && error['@type'] === 'error' && error.message) {
        errorString = error.message;
      } else {
        errorString = JSON.stringify(error);
      }

      setBadPassword({'state': true, 'errorString': errorString});
    });
  }

  return (
      <TizenPage>
        <div className="ui-header">
          <p style={{}}>
            {connecting ?
                (<>Connection is lost. Reconnecting...</>) :
                (<>Enter your password</>)}
          </p>
        </div>
        <div className="ui-content">
          <p style={{margin: '.5rem 0', fontSize: '24px', lineHeight: '28px'}}>
            Your account is protected<br/>with an additional password
          </p>
          <input ref={inputEl} placeholder={passwordHint.current || ''} type="password"
                 onClick={() => setBadPassword({state: false, errorString: ''})}/>
          {badPassword.state && <p className="bad-input">{badPassword.errorString}</p>}
          <div className="ui-footer ui-bottom-button">
            <button className="ui-btn"
                    type="button" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
        {isSuccess && <Redirect to="/"/>}
      </TizenPage>
  );
}