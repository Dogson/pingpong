import React from 'react';
import {initGames} from "./util/endpoitns";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    BrowserHistory
} from "react-router-dom";
import {Home} from "./pages/home";
import {AuthHome} from "./pages/authHome";
import {CurrentGame} from "./components/currentGame";
import { createBrowserHistory } from 'history'


// initGames();

function App() {

    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/home" component={AuthHome}/>
                <Route exact path="/game" component={CurrentGame}/>
            </Switch>
        </Router>
    );
}

export default App;
