import React, {useEffect, useState} from 'react';
import LoadingSpinner from "./LoadingSpinner";

function WebsiteSelect(props) {
    const [isLoading, setIsLoading] = useState(true);
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
                <select className={'form-select'} onChange={(e) => {
                    onChange(e.target.value)
                }} defaultValue={""}>
                    <option key={0} value="">{selectName}</option>
                    {websites.map((type) => (
                        <option key={type.name} value={type.id}>{type.name}</option>
                    ))}
                </select>
            )}
        </div>
    );
}

export default WebsiteSelect;
