import React, {useEffect, useState} from 'react';
import VehicleTypeSelect from "../VehicleTypeSelect";
import SearchQueryInput from "../SearchQueryInput";
import GameUpdateSelect from "../GameUpdateSelect";
import WebsiteSelect from "../WebsiteSelect";
import {Link} from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";

function Home() {
    const [searchQuery, setSearchQuery] = useState({query: '', game_update: [], vehicle_type: 0, website: 0});
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const updateData = () => {
        setIsLoading(true);

        let postData = {
            q: searchQuery.query,
            type: searchQuery.vehicle_type,
            website: searchQuery.website,
            game_update: searchQuery.game_update,
        };

        fetch(`/api/vehicles`, {
            method: "POST",
            headers: new Headers({
                "Accept": "application/json"
            }),
            body: JSON.stringify(postData)
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

    function gameUpdateOnChange(id, value) {
        if (value) {
            // Add to array
            setSearchQuery({...searchQuery, game_update: searchQuery.game_update.concat(id)});
        } else {
            // Remove from array
            setSearchQuery({...searchQuery, game_update: searchQuery.game_update.filter(function (item) {
                    return item !== id;
            })});
        }
    }

    function websiteOnChange(value) {
        setSearchQuery({...searchQuery, website: value});
    }

    function searchQueryOnChange(value) {
        setSearchQuery({...searchQuery, query: value});
    }

    return (
        <>
            <div className={"row"}>
                <div className="col-sm-12 col-md-3">
                    <div className={'mb-3'}>
                        <SearchQueryInput placeholderText={'Search'} onChange={searchQueryOnChange}/>
                    </div>
                    <div className={'mb-3'}>
                        <VehicleTypeSelect onChange={vehicleTypeOnChange} selectName={'Select a vehicle type'}/>
                    </div>
                    <div className={'mb-3'}>
                        <GameUpdateSelect onChange={gameUpdateOnChange} selectName={'Select an update'}/>
                    </div>
                    <div className={'mb-3'}>
                        <WebsiteSelect onChange={websiteOnChange} selectName={'Select a website'}/>
                    </div>
                </div>
                <div className="col-sm-12 col-md-9">
                    {isLoading ? (
                        <div className="text-center">
                            <LoadingSpinner className={'my-10'}/>
                        </div>
                    ) : (
                        <>
                            {vehicles.length > 0 ? (
                                <div className="row">
                                    {vehicles.length === 100 && (
                                        <div className="col-12 mb-1">Search results limited to 100 results, please refine your search query.</div>
                                    )}
                                    {vehicles.map((vehicle, key) => (
                                        <div className={'col-xs-12 col-sm-6 col-md-4 col-xl-3'} key={key}>
                                            <Link className={'text-decoration-none'} to={`/vehicle/${vehicle.slug}`}>
                                                <img loading="lazy" className={'img-fluid'} src={vehicle.image_url} alt=""/>
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
                </div>
            </div>
        </>
    );
}

export default Home;
