import React from 'react';
import {NavLink} from 'react-router-dom';
import './Card.css'


const Card = props => {
    return <div className="card-deck">
        <div className='card'>
            {props.image ? <img className="card-img-top" alt='постер' src={props.image}/> : null}
            {props.header || props.text || props.link ? <div className="card-body">
                {props.header ? <h5 className="card-title">{props.header}</h5> : null}
                {props.text ? <p className="card-text">{props.text}</p> : null}
                {props.link ? <NavLink to={props.link.url} className="btn btn-primary">
                    {props.link.text}
                </NavLink> : null}
            </div> : null}
        </div>
    </div>


    // return <div className="card-deck">
    //     <div className="card md-4 box-shadow">
    //         <img className='img-fluid ' src={props.image} alt='постер'/>
    //         <div className="card-body">
    //             <h5 className="card-title">{props.header}</h5>
    //             <div className="card-text">
    //                 <div className="d-flex justify-content-between align-items-center">
    //                     <div className='btn-group'>
    //                         <NavLink to={props.link.url}>
    //                             <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
    //                         </NavLink>
    //                         <button type="button" className="btn btn-sm btn-outline-secondary">Edit</button>
    //                         <small className="text-muted">9 mins</small>
    //                     </div>
    //                 </div>
    //
    //             </div>
    //         </div>
    //     </div>
    // </div>

};

// Пример Фарида
// + (props.className ? props.className : "")

export default Card;