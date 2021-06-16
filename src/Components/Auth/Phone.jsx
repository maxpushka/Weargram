import React, {useState} from 'react';
import TdLibController from '../../Utils/TdLibController';

export default function Phone() {
  const [phone, setPhone] = useState(null);

  // todo: add back button handling

  return (
      <>
        {!phone && <EnterPhone setPhone={setPhone}/>}
        {phone && <EnterCode phone={phone}/>}
      </>
  );
}

function EnterPhone({setPhone}) {
  function getPhone() {
    const phone = document.getElementById('phone-number').value;
    console.log(`read phone value: ${phone}`);
    setPhone(phone);
  }

  return (
      <div className="ui-page ui-page-active">
        <div className="ui-header">
          <p style={{fontSize: '24px', lineHeight: '29px', padding: '0 62px'}}>
            Please enter your phone number in the international format
          </p>
        </div>
        <div className="ui-content" style={{paddingTop: '28px'}}>
          <input id="phone-number" name="phone-number" type="text"
                 placeholder="+12223334455"/>
          // todo: add 'Login by QR code' redirect button
        </div>
        <div className="ui-footer ui-bottom-button">
          <button className="ui-btn" onClick={getPhone}>Next</button>
        </div>
      </div>
  );
}

function EnterCode({phone}) {
  return (
      <div className="ui-page ui-page-active">
        <div className="ui-header flex">
          <button onClick={() => console.log('read code')}
                  className="ui-btn ui-btn-icon ui-btn-circle btn-medium"
                  style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL +
                    '/icons/edit_white_48dp.svg'}`,
                  }}/>
        </div>
        <div className="ui-content flexBody">
          <p>{phone}</p>
          <p>We have sent the code to the Telegram app on your other device</p>
          <input id="code" name="code" type="text" placeholder="Code"/>
        </div>
        <div className="ui-footer ui-bottom-button">
          <button className="ui-btn" onClick={}>Next</button>
        </div>
      </div>
  );
}