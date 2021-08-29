import React, {useState} from 'react';

function SearchQueryInput(props) {
    const[state, setState] = useState({value: ''});
    const {onChange: parentOnChange, className, placeholderText} = props;

    function onInputChange(event) {
        setState({value: event.target.value});
        parentOnChange(event.target.value);
    }

    return (
        <>
            <div className="form-floating mb-3">
                <input type="text" className={`form-control ${className ?? ""}`} value={state.value} onChange={onInputChange} id={'vehicle_search_query'} placeholder={placeholderText}/>
                <label htmlFor={'vehicle_search_query'}>{placeholderText}</label>
            </div>
        </>
    );
}

export default SearchQueryInput;
