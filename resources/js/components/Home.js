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
                                    <th scope="col" className={'d-none d-md-table-cell'}/>
                                    <th scope="col">Name</th>
                                    <th scope="col" className={'d-none d-md-table-cell'}>Type</th>
                                    <th scope="col" className={'d-none d-md-table-cell'}>Website</th>
                                </tr>
                                </thead>
                                <tbody>
                                {vehicles.map((vehicle, key) => (
                                    <tr key={key}>
                                        <td className={'d-none d-md-table-cell'}>
                                            <img className={'img-fluid'} src={vehicle.image_url} alt=""/>
                                        </td>
                                        <td>
                                            <img className={'img-fluid d-md-none'} src={vehicle.image_url} alt=""/>
                                            {vehicle.name}
                                            <span className={'d-md-none'}>{vehicle.website}</span>
                                        </td>
                                        <td className={'d-none d-md-table-cell'}>{vehicle.type}</td>
                                        <td className={'d-none d-md-table-cell'}>{vehicle.website}</td>
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
