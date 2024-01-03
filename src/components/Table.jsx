import React, { useCallback, useEffect, useRef, useState } from 'react'
import "./Table.css"
import axios from 'axios';
import Loader from './Loader';

const Table = () => {
    const [data, setData] = useState(null);
    const [currPage, setCurrPage] = useState(0);
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(5);
    const inputRef = useRef(null);
    const [prev, setPrev] = useState("")
    const [next, setNext] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const handleKeyPress = useCallback((event) => {
        if (event.ctrlKey === true && event.key == "/") {
            event.preventDefault();
            inputRef.current.focus();

        }
    }, []);

    useEffect(() => {

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            setCurrPage(1)
            fetchData();
        }
    };


    const fetchData = () => {
        setIsLoading(true)
        console.log(search)
        var options = {
            method: 'GET',
            url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
            params: { namePrefix: search, limit: limit, offset: 0 },
            headers: {
                'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
                'x-rapidapi-key': import.meta.env.VITE_API_KEY
            }
        };

        axios.request(options).then(function (response) {
            console.log(response.data)
            setData(response.data.data);
            let prevL = null, nextL = null;
            response?.data?.links?.map((item) => {
                if (item.rel == "prev") {
                    prevL = item.href;
                }
                if (item.rel == "next") {
                    nextL = item.href
                }
            })
            setPrev(prevL);
            setNext(nextL);
            setIsLoading(false)
        }).catch(function (error) {
            console.error(error);
        });
    }

    const fetchDatafromLinks = (link) => {
        setData(null)
        setIsLoading(true);
        axios.get(`https://wft-geo-db.p.rapidapi.com${link}`, {
            headers: {
                'x-rapidapi-key': import.meta.env.VITE_API_KEY
            }
        }).then(function (response) {
            console.log(response.data)
            setData(response.data.data);
            let prevL = null, nextL = null;
            response?.data?.links?.map((item) => {
                if (item.rel == "prev") {
                    prevL = item.href;
                }
                if (item.rel == "next") {
                    nextL = item.href
                }
            })
            setPrev(prevL);
            setNext(nextL);
            setIsLoading(false)
        }).catch(function (error) {
            console.error(error);
        });
    }





    return (
        <div>
            <div className='searchBox'>
                <input ref={inputRef} className='input-box' value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleKeyDown} />
                <div className='shortcut' >


                    Ctrl+/

                </div>
            </div>

            <table  >
                <tr>
                    <th>
                        #
                    </th>
                    <th>
                        Place Name
                    </th>
                    <th>
                        Country
                    </th>


                </tr>
                {

                    data && data.length > 0 && data.map((item, key) => {
                        return (
                            <tr>
                                <td>
                                    {(currPage - 1) * limit + key + 1}
                                </td>
                                <td>
                                    {item.city}

                                </td>
                                <td>
                                    {item.country} {

                                    }
                                </td>
                            </tr>
                        )
                    })
                }


            </table>

            <div>
                {isLoading && !data ? <Loader /> :

                    data ? data.length > 0 ?


                        null : <p className='prompt' >
                            No result found
                        </p> : <p className='prompt' >
                        Start Searching
                    </p>
                }
            </div>

            <div className='pagination-parent'>
                <div className='pagination'>
                    <button disabled={!prev || prev.length == 0} className='nav-box' onClick={() => { setCurrPage(currPage - 1); fetchDatafromLinks(prev) }}>
                        Prev
                    </button>
                    <p className='page-display'>
                        {currPage}
                    </p>
                    <button disabled={!next || next.length == 0} className='nav-box' onClick={() => { setCurrPage(currPage + 1); fetchDatafromLinks(next) }}>
                        Next
                    </button>
                </div>
                <div className='limit-div'>

                    <button disabled={limit == 1} className='limit-change' onClick={() => setLimit(limit - 1)}>
                        -
                    </button>
                    <div className='limit-display'>
                        Per page items:  {limit}
                    </div>
                    <button disabled={limit == 10} className='limit-change' onClick={() => setLimit(limit + 1)}>
                        +
                    </button>
                </div>
            </div>
        </div >
    )
}

export default Table