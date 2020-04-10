import React from 'react';
import {initGames} from "./util/endpoitns";
import {resetAllGames} from "./util/endpoitns";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    BrowserHistory
} from "react-router-dom";
import {Home} from "./pages/home";
import {AuthHome} from "./pages/authHome";
import {CurrentGame} from "./pages/currentGame";
import {Results} from "./pages/results";
import { createBrowserHistory } from 'history'


// resetAllGames();

function App() {

    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/home" component={AuthHome}/>
                <Route exact path="/game" component={CurrentGame}/>
                <Route exact path="/results" component={Results}/>
            </Switch>
        </Router>
    );
}

export default App;
