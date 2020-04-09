import React from 'react';
import {initGames} from "./util/endpoitns";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {Home} from "./pages/home";
import {AuthHome} from "./pages/authHome";

// initGames();

function App() {

    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route exact path="/current-games">
                    <AuthHome />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
