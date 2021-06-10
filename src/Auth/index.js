import React from 'react';
import {Switch, Route, useRouteMatch} from 'react-router-dom';

import LoginOnboarding from "./LoginOnboarding";
import PhoneLogin from "./PhoneLogin";
import QrLogin from "./QrLogin";

export default function Auth() {
    const {url} = useRouteMatch();
    const phoneLogin = `${url}/phone`;
    const qrLogin = `${url}/qr`;

    return (
        <div className="ui-page" id="login">
            <Switch>
                <Route exact path={url}>
                    <LoginOnboarding phoneLoginPath={phoneLogin} qrLoginPath={qrLogin}/>
                </Route>
                <Route path={phoneLogin} component={PhoneLogin}/>
                <Route path={qrLogin} component={QrLogin}/>
            </Switch>
        </div>
    )
}