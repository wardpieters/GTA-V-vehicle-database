import React, {useEffect, useState} from 'react';
import VehicleTypeSelect from "../VehicleTypeSelect";
import SearchQueryInput from "../SearchQueryInput";
import GameUpdateSelect from "../GameUpdateSelect";
import WebsiteSelect from "../WebsiteSelect";
import {Link} from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";

function Home() {
    const [searchQuery, setSearchQuery] = useState({query: '', game_update: 0, vehicle_type: 0, website: 0});
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const updateData = () => {
        let searchParams = new URLSearchParams({
            q: searchQuery.query,
            type: searchQuery.vehicle_type,
            website: searchQuery.website,
            game_update: searchQuery.game_update,
        }).toString();

        fetch(`/api/vehicles?${searchParams}`, {
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
                <div className="col-auto mb-2 mb-xl-0">
                    <SearchQueryInput onChange={searchQueryOnChange}/>
                </div>
                <div className="col-auto mb-2 mb-xl-0">
                    <VehicleTypeSelect onChange={vehicleTypeOnChange} selectName={'Select a vehicle type'}/>
                </div>
                <div className="col-auto mb-2 mb-xl-0">
                    <GameUpdateSelect onChange={gameUpdateOnChange} selectName={'Select an update'}/>
                </div>
                <div className="col-auto">
                    <WebsiteSelect onChange={websiteOnChange} selectName={'Select a website'}/>
                </div>
            </div>
            {isLoading ? (
                <LoadingSpinner/>
            ) : (
                <>
                    {vehicles.length > 0 ? (
                        <div className="row">
                            {vehicles.length === 100 && (
                                <div className="col-12">Search results limited to 100 results, please refine your search query.</div>
                            )}
                            {vehicles.map((vehicle, key) => (
                                <div className={'col-xs-12 col-sm-6 col-md-4 col-xl-3'} key={key}>
                                    <Link className={'text-decoration-none'} to={`/vehicle/${vehicle.slug}`}>
                                        <img className={'img-fluid'} src={vehicle.image_url} alt=""/>
                                        <h4 className={'text-black mt-1 mb-0'}>
                                            {vehicle.name}
                                        </h4>
                                    </Link>
                                    {vehicle.type?.name && (
                                        <p className="text-muted mb-1">{vehicle.type?.name}</p>
                                    )}
                                    {vehicle.websites.length > 0 ? (
                                        <div>
                                            <p className={'mb-1'}>{new Intl.NumberFormat('nl-NL', {
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
