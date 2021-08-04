import React, {useState} from 'react';

function SearchQueryInput(props) {
    const[state, setState] = useState({value: ''});
    const {onChange: parentOnChange, className} = props;

    function onInputChange(event) {
        setState({value: event.target.value});
        parentOnChange(event.target.value);
    }

    return (
        <>
            <input type="text" className={`${className ?? ""}`} value={state.value} onChange={onInputChange} />
        </>
    );
}

export default SearchQueryInput;
