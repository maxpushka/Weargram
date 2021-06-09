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
        <Switch>
            <Route exact path={url}>
                <LoginOnboarding phoneLoginPath={phoneLogin} qrLoginPath={qrLogin}/>
            </Route>
            <Route exact path={phoneLogin}>
                <PhoneLogin/>
            </Route>
            <Route exact path={qrLogin}>
                <QrLogin/>
            </Route>
        </Switch>
    )
}