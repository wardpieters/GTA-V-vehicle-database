import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";

function VehicleDetails() {
    const history = useHistory();
    const {slug} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [vehicle, setVehicle] = useState({});

    useEffect(() => {
        fetch(`/api/vehicles/${slug}`, {
            method: "GET",
            headers: new Headers({
                "Accept": "application/json"
            })
        })
            .then(res => res.json())
            .then(res => {
                setVehicle(res.data);
                setIsLoading(false);
            })
            .catch(error => console.log(error))
    }, []);

    return (
        <>
            <p onClick={history.goBack} className="text-muted cursor-pointer mb-1">&larr; Back</p>
            <div className={'my-3'}>
                {isLoading ? (
                    <LoadingSpinner/>
                ) : (
                    <div className={'vehicle-details'}>
                        <img className={'img-fluid d-none d-lg-block float-lg-end vehicle-details__image'}
                             src={vehicle.image_url} alt=""/>
                        <h3 className={'mb-0'}>{vehicle.name}</h3>
                        <p className="text-muted mb-1">{vehicle.type.name}</p>
                        <img className={'img-fluid d-lg-none'} src={vehicle.image_url} alt=""/>
                        <p className={'mb-1'}>Brand: {vehicle.type.name}</p>
                        <p className={'mb-1'}>Seats: {vehicle.seats}</p>
                        <p className={'mb-1'}>Game
                            update: {vehicle.game_update ? (vehicle.game_update?.name) : "N/A"}</p>
                        <p className={'mb-1'}>Speed: {Math.round((vehicle.speed + Number.EPSILON) * 100) / 100}%</p>
                        <p className={'mb-1'}>Acceleration: {Math.round((vehicle.acceleration + Number.EPSILON) * 100) / 100}%</p>
                        <p className={'mb-1'}>Braking: {Math.round((vehicle.braking + Number.EPSILON) * 100) / 100}%</p>
                        <p className={'mb-1'}>Buy price: {new Intl.NumberFormat('nl-NL', {
                            style: 'currency',
                            currency: 'USD'
                        }).format(vehicle.cost)}</p>
                        <p className={'mb-1'}>Sell price: {vehicle.sellable ? (
                            new Intl.NumberFormat('nl-NL', {
                                style: 'currency',
                                currency: 'USD'
                            }).format(vehicle.sell_price)
                        ) : "N/A"}</p>
                        {vehicle.websites.length > 0 ? (
                            <div>
                                <p className="mb-1">Available at:
                                    {vehicle.websites?.map((website) => (
                                        <span key={website.id}> {website.name}</span>
                                    ))}
                                </p>
                            </div>
                        ) : <p className="text-muted mb-0">Not available for purchase</p>}
                    </div>
                )}
            </div>
        </>
    );
}

export default VehicleDetails;
