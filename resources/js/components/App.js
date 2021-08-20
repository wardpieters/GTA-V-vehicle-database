import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from "./Pages/Home";
import VehicleDetails from "./Pages/VehicleDetails";
import NotFound from "./Pages/NotFound";

function App() {
    return (
        <div className="container mt-3">
            <Router>
                <div>
                    <Switch>
                        <Route path="/" exact={true}>
                            <Home/>
                        </Route>
                        <Route path="/vehicle/:slug" exact={true}>
                            <VehicleDetails/>
                        </Route>
                        <Route path="*">
                            <NotFound />
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
