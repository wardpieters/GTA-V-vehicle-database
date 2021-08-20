import React from 'react';
import {Link} from "react-router-dom";

function NotFound() {
    return (
        <div>
            <h1>Not Found :(</h1>
            <p>Click <Link to={'/'}>here</Link> to go back home.</p>
        </div>
    );
}

export default NotFound;
