import React, {useEffect, useState} from 'react';
import VehicleTypeSelect from "./VehicleTypeSelect";
import SearchQueryInput from "./SearchQueryInput";
import GameUpdateSelect from "./GameUpdateSelect";
import WebsiteSelect from "./WebsiteSelect";

function Home() {
    const [searchQuery, setSearchQuery] = useState({query: '', game_update: 0, vehicle_type: 0, website: 0});
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const updateData = () => {
        fetch(`/api/vehicles?q=${searchQuery.query}&type=${searchQuery.vehicle_type}&website=${searchQuery.website}&game_update=${searchQuery.game_update}`, {
            method: "GET",
            headers: new Headers({
                "Accept": "application/json"
            })
        })
            .then(res => res.json())
            .then(res => {
                setVehicles(res.data);
                setIsLoading(false);
            })
            .catch(error => console.log(error))
    }

    useEffect(() => {
        updateData()
    }, []);

    useEffect(() => {
        updateData()
    }, [searchQuery]);

    function vehicleTypeOnChange(value) {
        setSearchQuery({...searchQuery, vehicle_type: value});
    }

    function gameUpdateOnChange(value) {
        setSearchQuery({...searchQuery, game_update: value});
    }

    function websiteOnChange(value) {
        setSearchQuery({...searchQuery, website: value});
    }

    function searchQueryOnChange(value) {
        setSearchQuery({...searchQuery, query: value});
    }

    return (
        <>
            <div className={"row mb-3"}>
                <div className="col-auto">
                    <SearchQueryInput onChange={searchQueryOnChange}/>
                </div>
                <div className="col-auto">
                    <VehicleTypeSelect onChange={vehicleTypeOnChange} selectName={'Select an option'}/>
                </div>
                <div className="col-auto">
                    <GameUpdateSelect onChange={gameUpdateOnChange} selectName={'Select an option'}/>
                </div>
                <div className="col-auto">
                    <WebsiteSelect onChange={websiteOnChange} selectName={'Select an option'}/>
                </div>
            </div>
            {isLoading ? <p>Loading...</p> : (
                <>
                    {vehicles.length > 0 ? (
                        <div className="row">
                            {vehicles.map((vehicle, key) => (
                                <div className={'col-xs-12 col-sm-6 col-md-4 col-xl-3'} key={key}>
                                    <img className={'img-fluid'} src={vehicle.image_url} alt=""/>
                                    <h3 className={'mt-1'}>{vehicle.name}{vehicle.type?.name && (
                                        <span className="text-muted ml-1">({vehicle.type?.name})</span>)}</h3>
                                    {vehicle.websites.length > 0 ? (
                                        <div>
                                            <p>{new Intl.NumberFormat('nl-NL', {
                                                style: 'currency',
                                                currency: 'USD'
                                            }).format(vehicle.cost)}</p>
                                            <p className="text-muted mb-0">Available at:</p>
                                            {vehicle.websites?.map((website) => (
                                                <p className={'mb-1'} key={website.id}>{website.name}</p>
                                            ))}
                                        </div>
                                    ) : <p className="text-muted mb-0">Not available for purchase</p>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>No results</div>
                    )}
                </>
            )}
        </>
    );
}

export default Home;
