import React, {useEffect, useState} from 'react';
import {Collapse} from 'react-bootstrap'
import LoadingSpinner from "./LoadingSpinner";

function GameUpdateSelect(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
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
                <div className={`checkbox-container ${isCollapsed ? "collapsed" : ""}`}>
                    <div className={'checkbox-container__header'}>
                        <p className={'mb-0'} onClick={() => {setIsCollapsed(!isCollapsed)}}>{selectName}</p>
                    </div>
                    <Collapse in={isCollapsed}>
                        <div className={'checkbox-container__collapse'}>
                            {gameUpdates.map((type) => (
                                <label htmlFor={`game_update_${type.id}`} key={type.name} className={"d-block mb-1"}>
                                    <input onChange={(e) => {onChange(type.id, e.target.checked)}} type="checkbox" name={"game_update"} id={`game_update_${type.id}`} value={type.id}/>
                                    <span className={"ms-1"}>{type.name}<span className={'text-muted'}> ({type.vehicles})</span></span>
                                </label>
                            ))}
                        </div>
                    </Collapse>
                </div>
            )}
        </div>
    );
}

export default GameUpdateSelect;
