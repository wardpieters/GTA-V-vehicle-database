import React, {useEffect, useState} from 'react';
import VehicleTypeSelect from "../VehicleTypeSelect";
import SearchQueryInput from "../SearchQueryInput";
import GameUpdateSelect from "../GameUpdateSelect";
import WebsiteSelect from "../WebsiteSelect";
import {Link} from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import ErrorBoundary from "../ErrorBoundary";
import {useDebouncedValue} from '@mantine/hooks';
import ReactPaginate from 'react-paginate';

function Home() {
    const [searchQuery, setSearchQuery] = useState({query: '', game_update: [], vehicle_type: [], website: []});
    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 200);
    const [vehicleData, setVehicleData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const updateData = () => {
        setIsLoading(true);

        let postData = {
            q: searchQuery.query,
            type: searchQuery.vehicle_type,
            website: searchQuery.website,
            game_update: searchQuery.game_update,
            page: currentPage + 1
        };

        fetch(`/api/vehicles`, {
            method: "POST",
            headers: new Headers({
                "Accept": "application/json",
                "Content-Type": "application/json",
            }),
            body: JSON.stringify(postData)
        })
            .then(res => res.json())
            .then(res => {
                setVehicleData(res);
                setIsLoading(false);
            })
            .catch(error => console.log(error))
    }

    useEffect(() => {
        updateData()
    }, [debouncedSearchQuery, currentPage]);

    function arrayVariableOnChange(variable, id, value) {
        setSearchQuery({
            ...searchQuery,
            [variable]: (value) ? searchQuery[variable].concat(id) : searchQuery[variable].filter(function (item) {
                return item !== id;
            })
        });
    }

    function searchQueryOnChange(value) {
        setSearchQuery({...searchQuery, query: value});
    }

    function roundNumber(number) {
        return Math.round((number + Number.EPSILON) * 100) / 100
    }

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    return (
        <>
            <div className={"row"}>
                <div className="col-sm-12 col-md-4 col-lg-3">
                    <div className={'mb-3'}>
                        <SearchQueryInput placeholderText={'Search'} onChange={searchQueryOnChange}/>
                    </div>
                    <div className={'mb-3'}>
                        <VehicleTypeSelect onChange={arrayVariableOnChange} selectName={'Select a vehicle type'}/>
                    </div>
                    <div className={'mb-3'}>
                        <GameUpdateSelect onChange={arrayVariableOnChange} selectName={'Select an update'}/>
                    </div>
                    <div className={'mb-3'}>
                        <WebsiteSelect onChange={arrayVariableOnChange} selectName={'Select a website'}/>
                    </div>
                </div>
                <div className="col-sm-12 col-md-8 col-lg-9">
                    {isLoading ? (
                        <div className="text-center">
                            <LoadingSpinner className={'my-10'}/>
                        </div>
                    ) : (
                        <>
                            {vehicleData.data?.length > 0 ? (
                                <div>
                                    <ErrorBoundary>
                                        {vehicleData.data?.length === 100 && (
                                            <p>Search results limited to 100 results, please refine your search
                                                query.</p>
                                        )}
                                        <div className="flip-cards">
                                            {vehicleData.data?.map((vehicle, key) => (
                                                <div className={'flip-card'} key={key}>
                                                    <div className="flip-card-body">
                                                        <div className="flip-card-front">
                                                            <div>
                                                                <img loading="lazy" className={'img-fluid'}
                                                                     src={vehicle.image_url} alt={vehicle.name}/>
                                                            </div>
                                                        </div>
                                                        <div className="flip-card-back bg-dark text-white">
                                                            <div className="p-2 w-100">
                                                                <div>
                                                                    <p className="mb-0 text-uppercase">Speed</p>
                                                                    <div className="progress">
                                                                        <div className="progress-bar" role="progressbar"
                                                                             style={{width: `${roundNumber(vehicle.speed)}%`}}
                                                                             aria-valuenow={roundNumber(vehicle.speed)}
                                                                             aria-valuemin="0"
                                                                             aria-valuemax="100">{roundNumber(vehicle.speed)}%
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="mb-0 text-uppercase">Acceleration</p>
                                                                    <div className="progress">
                                                                        <div className="progress-bar" role="progressbar"
                                                                             style={{width: `${roundNumber(vehicle.acceleration)}%`}}
                                                                             aria-valuenow={roundNumber(vehicle.acceleration)}
                                                                             aria-valuemin="0"
                                                                             aria-valuemax="100">{roundNumber(vehicle.acceleration)}%
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="mb-0 text-uppercase">Braking</p>
                                                                    <div className="progress">
                                                                        <div className="progress-bar" role="progressbar"
                                                                             style={{width: `${roundNumber(vehicle.braking)}%`}}
                                                                             aria-valuenow={roundNumber(vehicle.braking)}
                                                                             aria-valuemin="0"
                                                                             aria-valuemax="100">{roundNumber(vehicle.braking)}%
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="mb-0 text-uppercase">Traction</p>
                                                                    <div className="progress">
                                                                        <div className="progress-bar" role="progressbar"
                                                                             style={{width: `${roundNumber(vehicle.handling)}%`}}
                                                                             aria-valuenow={roundNumber(vehicle.handling)}
                                                                             aria-valuemin="0"
                                                                             aria-valuemax="100">{roundNumber(vehicle.handling)}%
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flip-card-content">
                                                        <Link className={'text-decoration-none'}
                                                              to={`/vehicle/${vehicle.slug}`}>
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
                                                                    <p className={'mb-1'}
                                                                       key={website.id}>{website.name}</p>
                                                                ))}
                                                            </div>
                                                        ) : <p className="text-muted mb-0">Not available for
                                                            purchase</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ErrorBoundary>
                                </div>
                            ) : (
                                <div>No results</div>
                            )}
                        </>
                    )}
                    <div className="d-flex align-items-center justify-content-center">
                        <ReactPaginate
                            previousLabel={<span aria-hidden="true">&laquo;</span>}
                            nextLabel={<span aria-hidden="true">&raquo;</span>}
                            breakLabel={'...'}
                            pageCount={vehicleData.meta?.last_page}
                            marginPagesDisplayed={3}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            activeClassName={'active'}
                            initialPage={0}
                            pageClassName={"page-item"}
                            containerClassName={"pagination"}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-link"}
                            breakClassName={'page-item disabled'}
                            breakLinkClassName={'page-link'}
                            nextClassName={"page-link"}
                            disabledClassName={"page-link disabled"}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
