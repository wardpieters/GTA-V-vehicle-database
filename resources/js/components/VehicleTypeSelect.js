import React, {useEffect, useState} from 'react';

function VehicleTypeSelect(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [types, setTypes] = useState([]);
    const {onChange} = props;

    useEffect(() => {
        fetch(`/api/vehicles/types`, {
            method: "GET",
            headers: new Headers({
                "Accept": "application/json"
            })
        })
            .then(res => res.json())
            .then(res => {
                setTypes(res.data);
                setIsLoading(false);
            })
            .catch(error => console.log(error))
    }, []);

    return (
        <div>
            {isLoading ? <p>Loading...</p> : (
                <select className={'form-select'} onChange={(e) => {onChange(e.target.value)}} defaultValue={""}>
                    <option key={0} value="">NO FILTER</option>
                    {types.map((type, key) => (
                        <option key={type.name} value={type.id}>{type.name_formatted}</option>
                    ))}
                </select>
            )}
        </div>
    );
}

export default VehicleTypeSelect;
