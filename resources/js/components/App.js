import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Home from "./Home";

function App() {
    return (
        <div className="container mt-3">
            <Router>
                <div>
                    <Switch>
                        <Route path="/">
                            <Home/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App/>, document.getElementById('app'));
}
