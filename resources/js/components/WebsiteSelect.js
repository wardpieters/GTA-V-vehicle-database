import React, {useEffect, useState} from 'react';
import LoadingSpinner from "./LoadingSpinner";
import {Collapse, Form} from "react-bootstrap";

function WebsiteSelect(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [websites, setWebsites] = useState([]);
    const {onChange, selectName} = props;

    useEffect(() => {
        fetch(`/api/websites`, {
            method: "GET",
            headers: new Headers({
                "Accept": "application/json"
            })
        })
            .then(res => res.json())
            .then(res => {
                setWebsites(res.data);
                setIsLoading(false);
            })
            .catch(error => console.log(error))
    }, []);

    return (
        <div>
            {isLoading ? (
                <LoadingSpinner/>
            ) : (
                <>
                    <div className={`checkbox-container ${isCollapsed ? "collapsed" : ""}`}>
                        <div className={'checkbox-container__header'}>
                            <p className={'mb-0'} onClick={() => {setIsCollapsed(!isCollapsed)}}>{selectName}</p>
                        </div>
                        <Collapse in={isCollapsed}>
                            <div className={'checkbox-container__collapse'}>
                                {websites.map((website) => (
                                    <Form.Check key={website.id}
                                        type={"checkbox"}
                                        label={website.name}
                                        id={`website_${website.id}`}
                                        onChange={(e) => {onChange('website', website.id, e.target.checked)}}
                                    />
                                ))}
                            </div>
                        </Collapse>
                    </div>
                </>
            )}
        </div>
    );
}

export default WebsiteSelect;
