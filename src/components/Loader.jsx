import React from 'react'
import { ClipLoader } from 'react-spinners';
import "./Loader.css"
const Loader = () => {
    return (
        <div className='parent'>
            <ClipLoader color="#36d7b7" />
        </div>
    )
}

export default Loader