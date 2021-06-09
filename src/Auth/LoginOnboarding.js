import React from 'react';
import {Link} from 'react-router-dom';
import './index.css';

export default function LoginOnboarding(props) {
    return (
        <div className="ui-page" id="auth">
            <div className="ui-header flex" style={{height: "min-content", marginBottom: "22px"}}>
                <img src={process.env.PUBLIC_URL + '/icons/app-icon.svg'} alt="Weargram logo"
                     style={{width: "81px", height: "81px"}}/>
                <p style={{margin: "4px 0 1rem 0"}}>Sign in to Telegram</p>
            </div>

            <div className="ui-content flexBody">
                <div className="flex" style={{width: "120px"}}>
                    <Link to={props.phoneLoginPath} className="ui-btn ui-btn-icon ui-btn-circle button" style={{
                        backgroundImage: `url(${process.env.PUBLIC_URL + '/icons/phone_white_48dp.svg'})`
                    }}/>
                    <div className="buttonLabel">Log in by phone number</div>
                </div>

                <div className="flex" style={{width: "120px"}}>
                    <Link to={props.qrLoginPath} className="ui-btn ui-btn-icon ui-btn-circle button" style={{
                        backgroundImage: `url(${process.env.PUBLIC_URL + '/icons/round-qr-code-scanner.svg'})`
                    }}/>
                    <div className="buttonLabel">Log in by QR code</div>
                </div>
            </div>
        </div>
    )
}