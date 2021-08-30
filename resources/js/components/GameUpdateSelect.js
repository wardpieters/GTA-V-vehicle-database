import React, {useEffect, useState} from 'react';
import {Collapse, Form} from 'react-bootstrap'
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
                            {gameUpdates.map((gameUpdate) => (
                                <Form.Check key={gameUpdate.id}
                                    type={"checkbox"}
                                    label={<>{gameUpdate.name}<span className={'text-muted'}> ({gameUpdate.vehicles})</span></>}
                                    id={`game_update_${gameUpdate.id}`}
                                    onChange={(e) => {onChange('game_update', gameUpdate.id, e.target.checked)}}
                                />
                            ))}
                        </div>
                    </Collapse>
                </div>
            )}
        </div>
    );
}

export default GameUpdateSelect;
