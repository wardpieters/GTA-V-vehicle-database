import React, {useEffect, useState} from 'react';
import LoadingSpinner from "./LoadingSpinner";

function GameUpdateSelect(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [gameUpdates, setGameUpdates] = useState([]);
    const {onChange, selectName} = props;

    useEffect(() => {
        fetch(`/api/updates`, {
            method: "GET",
            headers: new Headers({
                "Accept": "application/json"
            })
        })
            .then(res => res.json())
            .then(res => {
                setGameUpdates(res.data);
                setIsLoading(false);
            })
            .catch(error => console.log(error))
    }, []);

    return (
        <div>
            {isLoading ? (
                <LoadingSpinner/>
            ) : (
                <select className={'form-select'} onChange={(e) => {onChange(e.target.value)}} defaultValue={""}>
                    <option key={0} value="">{selectName}</option>
                    {gameUpdates.map((type) => (
                        <option key={type.name} value={type.id}>{type.name} ({type.vehicles})</option>
                    ))}
                </select>
            )}
        </div>
    );
}

export default GameUpdateSelect;
