import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        console.error(error)
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h1>Something went wrong.</h1>
                    <p>If this keeps happening, please contact us.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
