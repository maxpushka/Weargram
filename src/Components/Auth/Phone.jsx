import React, {useEffect, useRef, useState} from 'react';
import {Redirect} from 'react-router-dom';
import ApplicationStore from '../../Utils/ApplicationStore';
import TdLibController from '../../Utils/TdLibController';
import {isConnecting} from './Auth';
import './Auth.css';

export default function Phone() {
  console.log('at Phone');
  const [phoneData, setPhone] = useState({phone: '', editFlag: false});
  const [connecting, setConnecting] = useState(() => ApplicationStore.getConnectionState());

  const editPhone = () => setPhone({...phoneData, editFlag: true});

  useEffect(() => {
    ApplicationStore.on('updateConnectionState', onUpdateConnectionState);
    return function() {
      ApplicationStore.off('updateConnectionState', onUpdateConnectionState);
    };
  }, []);

  function onUpdateConnectionState(update) {
    const {state} = update;
    setConnecting(isConnecting(state));
  }

  console.log('phoneData', phoneData, (phoneData.phone && !phoneData.editFlag));
  return (
      <>
        {(phoneData.phone !== '' && !phoneData.editFlag) ?
            <EnterCode phone={phoneData.phone} editPhone={editPhone} connecting={connecting}/> :
            <EnterPhone phoneData={phoneData} setPhone={setPhone} connecting={connecting}/>
        }
      </>
  );
}

function EnterPhone({phoneData, setPhone, connecting}) {
  console.log('at EnterPhone');
  const [badPhone, setBadPhone] = useState(false);
  const inputEl = useRef(null);

  useEffect(() => {
    console.log('setting up EnterPhone handlers...');
    ApplicationStore.on('clientUpdateSetPhoneResult', onSuccess);
    ApplicationStore.on('clientUpdateSetPhoneError', onError);

    return function() {
      console.log('cleaning up EnterPhone handlers...');
      ApplicationStore.off('clientUpdateSetPhoneResult', onSuccess);
      ApplicationStore.off('clientUpdateSetPhoneError', onError);
    };
  }, []);

  useEffect(() => {
    badPhone ?
        inputEl.current.classList.add('bad-phone') :
        inputEl.current.classList.remove('bad-phone');
  }, [badPhone]);

  useEffect(() => {
    if (phoneData.editFlag) {
      inputEl.current.value = phoneData.phone;
    }
  }, [phoneData.editFlag]);

  const onError = () => setBadPhone(true);

  function onSuccess() {
    setBadPhone(false);
    console.log('badPhone', badPhone);
    setPhone({phone: inputEl.current.value, editFlag: false});
  }

  async function getPhone() {
    const readPhone = inputEl.current.value;
    console.log(`read phone number value: ${readPhone}`);

    if (readPhone.startsWith('+')) {
      setPhone({phone: readPhone, editFlag: false});
      await ApplicationStore.setPhoneNumber(readPhone);
    } else setBadPhone(true);
  }

  return (
      <div className="ui-page ui-page-active">
        <div className="ui-header">
          <p style={{fontSize: '24px', lineHeight: '29px', margin: '1rem 0', padding: '0 62px'}}>
            {connecting ?
                (<>Connection is lost. Reconnecting...</>) :
                (<>Please enter your phone number in <i>international format</i></>)}
          </p>
        </div>
        <div className="ui-content" style={{paddingTop: '28px'}}>
          <input ref={inputEl} id="phone-number" type="text" inputMode="tel"
                 placeholder="+12223334455"
                 onClick={() => setBadPhone(false)}/>
          {badPhone && <p className="bad-phone">Invalid phone number</p>}
        </div>
        <div className="ui-footer ui-bottom-button">
          {!connecting && <button className="ui-btn" onClick={getPhone}>Next</button>}
        </div>
      </div>
  );
}

function EnterCode({phone, editPhone, connecting}) {
  console.log('at EnterCode');
  let [inputCode, setCode] = useState('');
  const [badCode, setBadCode] = useState({state: false, errorString: ''});
  let [loginSuccess, setLoginSuccess] = useState(false);
  const inputEl = useRef(null);
  const codeLength = useRef(getCodeLength());

  useEffect(() => {
    badCode.state ?
        inputEl.current.classList.add('bad-phone') :
        inputEl.current.classList.remove('bad-phone');
  }, [badCode]);

  function getCodeLength() {
    const codeInfo = ApplicationStore.getAuthorizationState();
    console.log('code_info', codeInfo);
    if (!codeInfo) return 0;
    if (!codeInfo.type) return 0;

    switch (codeInfo.type['@type']) {
      case 'authenticationCodeTypeCall': {
        return codeInfo.type.length;
      }
      case 'authenticationCodeTypeFlashCall': {
        return 0;
      }
      case 'authenticationCodeTypeSms': {
        return codeInfo.type.length;
      }
      case 'authenticationCodeTypeTelegramMessage': {
        return codeInfo.type.length;
      }
    }

    return 0;
  }

  function isValid(code) {
    let isBad = !code.match(/^[\d\-+\s]+$/);
    if (!isBad) {
      code = code.replace(/\D/g, '');
      if (code.length !== 5) {
        isBad = true;
      }
    }

    return !isBad;
  }

  function handleChange(event) {
    const code = event.target.value;

    setCode(code);
    console.log(code, codeLength.current,
        code && codeLength.current && code.length === codeLength.current);

    if (code && codeLength.current > 0 && code.length === codeLength.current)
      handleNext(code);
  }

  function handleNext(code) {
    if (code && isValid(code)) {
      handleDone(code);
    } else {
      setBadCode({state: true, errorString: 'Invalid code. Please try again.'});
    }
  }

  function handleDone(code) {
    TdLibController.send({
      '@type': 'checkAuthenticationCode',
      code,
      first_name: 'A',
      last_name: 'B',
    }).then(result => {
      console.log('successfully logged in', result);
      setLoginSuccess(true);
    }).catch(error => {
      let errorString = 'Invalid code';
      if (error && error['@type'] === 'error' && error.message) {
        if (error.message !== 'PHONE_CODE_INVALID') {
          errorString = error.message;
        }
      } else {
        errorString = JSON.stringify(error);
      }

      setBadCode({state: true, errorString});
    });
  }

  return (
      <div className="ui-page ui-page-active">
        <div className="ui-header flex">
          <button onClick={() => editPhone()}
                  className="ui-btn ui-btn-icon ui-btn-circle btn-medium"
                  style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL +
                    '/icons/edit_white_48dp.svg'}`,
                  }}/>
        </div>
        <div className="ui-content">
          <p style={{fontSize: '28px', margin: 0}}>{phone}</p>
          <p style={{fontSize: '18px', margin: '1rem 1.625rem', lineHeight: '22px'}}>
            {connecting ?
                (<>Connection is lost. Reconnecting...</>) :
                (<>We have sent the code to the Telegram app on your other device</>)}
          </p>
          <input id="code" type="text" placeholder="Code"
                 ref={inputEl} value={inputCode}
                 maxLength={codeLength.current > 0 ? codeLength.current : 256}
                 onClick={() => setBadCode({state: false})} onChange={handleChange}/>
          {badCode.state && <p className="bad-phone">{badCode.errorString}</p>}
          {loginSuccess && <Redirect to="/"/>}
        </div>
      </div>
  );
}
