import React from 'react';

function LoadingSpinner(props) {
    return (
        <div className={`spinner-border ${props.className}`} role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    );
}

export default LoadingSpinner;
