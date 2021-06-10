import React, {createContext} from "react";
import {Switch, Route} from "react-router-dom";
import {Airgram, /*Auth, toObject*/} from '@airgram/web';
import Login from './Auth';

const AppData = {
    airgram: new Airgram({
        apiId: process.env.REACT_APP_APP_ID,
        apiHash: process.env.REACT_APP_APP_HASH,
        // databaseDirectory: null,
        // filesDirectory: null,
        useFileDatabase: true,
        useChatInfoDatabase: true,
        useMessageDatabase: true,
        enableStorageOptimizer: true,
        // systemLanguageCode: null,
        // deviceModel: null,
        // systemVersion: null,
        // applicationVersion: null,
        logVerbosityLevel: 1,
        databaseEncryptionKey: "abc"
    })
};

export default function App() {
    const AppContext = createContext();

    return (
        <AppContext.Provider value={AppData}>
            <Switch>
                <Route path="/login" component={Login}/>
            </Switch>
        </AppContext.Provider>
    )
}