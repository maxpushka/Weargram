import React, {useEffect, useMemo, useState} from 'react';
import AppStore from '../../Utils/ApplicationStore';
import './index.css';
import TdLibController from '../../Utils/TdLibController';

// todo: handle phone password flood
export default function Phone() {
  console.log('at Phone');
  const [phoneData, setPhone] = useState({phone: '', editFlag: false});
  const editPhone = () => setPhone({...phoneData, editFlag: true});

  console.log('phoneData', phoneData, (phoneData.phone && !phoneData.editFlag));
  return (
      <>
        {(phoneData.phone !== '' && !phoneData.editFlag) ?
            <EnterCode phone={phoneData.phone} editPhone={editPhone}/> :
            <EnterPhone phoneData={phoneData} setPhone={setPhone}/>
        }
      </>
  );
}

function EnterPhone({phoneData, setPhone}) {
  // todo: handle too many attempts case
  console.log('at EnterPhone');
  const [badPhone, setBadPhone] = useState(false);

  useEffect(() => {
    this.inputEl = document.getElementById('phone-number');

    const onError = () => setBadPhone(true);
    const onSuccess = () => {
      setBadPhone(false);
      console.log('badPhone', badPhone);
      setPhone({phone: this.inputEl.value, editFlag: false});
    };

    console.log('setting up EnterPhone handlers...');
    AppStore.on('clientUpdateSetPhoneResult', onSuccess);
    AppStore.on('clientUpdateSetPhoneError', onError);

    return function cleanup() {
      console.log('cleaning up EnterPhone handlers...');
      AppStore.off('clientUpdateSetPhoneResult', onSuccess);
      AppStore.off('clientUpdateSetPhoneError', onError);
    };
  });

  useEffect(() => {
    badPhone ?
        this.inputEl.classList.add('bad-phone') :
        this.inputEl.classList.remove('bad-phone');
  }, [badPhone]);

  useEffect(() => {
    if (phoneData.editFlag) {
      this.inputEl.value = phoneData.phone;
    }
  }, [phoneData.editFlag]);

  async function getPhone() {
    const v = this.inputEl.value;
    console.log(`read phone number value: ${v}`);
    await AppStore.setPhoneNumber(v);
  }

  return (
      <div className="ui-page ui-page-active">
        <div className="ui-header">
          <p style={{fontSize: '24px', lineHeight: '29px', padding: '0 62px'}}>
            Please enter your phone number in <i>international format</i>
          </p>
        </div>
        <div className="ui-content" style={{paddingTop: '28px'}}>
          <input id="phone-number" type="text" inputMode="tel" placeholder="+12223334455"
                 onClick={() => setBadPhone(false)}/>
          {badPhone && <p className="bad-phone">Invalid phone number</p>}
        </div>
        <div className="ui-footer ui-bottom-button">
          <button className="ui-btn" onClick={getPhone}>Next</button>
        </div>
      </div>
  );
}

function EnterCode({phone, editPhone}) {
  console.log('at EnterCode');
  let [code, setCode] = useState('');

  useEffect(() => {
    this.code_info = AppStore.getAuthorizationState()['code_info'];
    console.log('codeInfo', this.code_info);
  });

  function handleChange(event) {
    setCode(event.target.value);
  }

  useEffect(() => {
    if (code === this.code_info.type.length) {
      TdLibController.send({'@type': 'checkAuthenticationCode', code});
      // todo: handle invalid code
    }
  }, [code]);

  return (
      <div className="ui-page ui-page-active">
        <div className="ui-header flex" style={{marginTop: '1rem'}}>
          <button onClick={() => editPhone()}
                  className="ui-btn ui-btn-icon ui-btn-circle btn-medium"
                  style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL +
                    '/icons/edit_white_48dp.svg'}`,
                  }}/>
        </div>
        <div className="ui-content">
          <p style={{fontSize: '28px', margin: '1rem 0 0 0'}}>{phone}</p>
          <p style={{fontSize: '18px', margin: '1rem 1.625rem', lineHeight: '22px'}}>
            We have sent the code to the Telegram app on your other device
          </p>
          <input id="code" type="text" placeholder="Code" onChange={handleChange} value={code}/>
        </div>
      </div>
  );
}
