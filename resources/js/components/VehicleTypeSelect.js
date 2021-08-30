import React, {useEffect, useState} from 'react';
import LoadingSpinner from "./LoadingSpinner";
import {Collapse, Form} from "react-bootstrap";

function VehicleTypeSelect(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [types, setTypes] = useState([]);
    const {onChange, selectName} = props;

    useEffect(() => {
        fetch(`/api/types`, {
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
            {isLoading ? (
                <LoadingSpinner/>
            ) : (
                <div className={`checkbox-container ${isCollapsed ? "collapsed" : ""}`}>
                    <div className={'checkbox-container__header'}>
                        <p className={'mb-0'} onClick={() => {
                            setIsCollapsed(!isCollapsed)
                        }}>{selectName}</p>
                    </div>
                    <Collapse in={isCollapsed}>
                        <div className={'checkbox-container__collapse'}>
                            {types.map((type) => (
                                <Form.Check key={type.id}
                                    type={"checkbox"}
                                    label={type.name}
                                    id={`type_${type.id}`}
                                    onChange={(e) => {onChange('vehicle_type', type.id, e.target.checked)}}
                                />
                            ))}
                        </div>
                    </Collapse>
                </div>
            )}
        </div>
    );
}

export default VehicleTypeSelect;
