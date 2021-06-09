import React from "react";
import {Switch, Route, BrowserRouter} from "react-router-dom";
import Auth from './Auth';

export default function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login"><Auth/></Route>
            </Switch>
        </BrowserRouter>
    )
}