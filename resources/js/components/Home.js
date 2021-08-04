import React, {useEffect, useState} from 'react';
import VehicleTypeSelect from "./VehicleTypeSelect";
import SearchQueryInput from "./SearchQueryInput";

function Home() {
    const [searchQuery, setSearchQuery] = useState({query: '', vehicle_type: ''});
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/vehicles?q=${searchQuery.query}&vehicle_type=${searchQuery.vehicle_type}`, {
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
    }, [searchQuery]);

    function vehicleTypeOnChange(value) {
        setSearchQuery({...searchQuery, vehicle_type: value});
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
                    <VehicleTypeSelect onChange={vehicleTypeOnChange}/>
                </div>
            </div>
            <div>
                {isLoading ? <p>Loading...</p> : (
                    <>
                        {vehicles.length > 0 ? (
                            <table className="table table-striped vehicle-table">
                                <thead>
                                <tr>
                                    <th scope="col"/>
                                    <th scope="col">Name</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Cost</th>
                                    <th scope="col">Sell price</th>
                                    <th scope="col">Website</th>
                                </tr>
                                </thead>
                                <tbody>
                                {vehicles.map((vehicle, key) => (
                                    <tr key={key}>
                                        <th scope="row">
                                            <img className={'img-fluid'} src={vehicle.image_url} alt=""/>
                                        </th>
                                        <td>{vehicle.vehicle_type}</td>
                                        <td>{vehicle.name}</td>
                                        <td>{(vehicle.sellable ? vehicle.sell_price : "N/A")}</td>
                                        <td>{vehicle.cost}</td>
                                        <td>{vehicle.website}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <div>No results</div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default Home;
