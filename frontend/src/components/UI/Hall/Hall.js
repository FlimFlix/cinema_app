import React from 'react';
import {NavLink} from 'react-router-dom';


const Hall = props => {
    return <div className={"card mt-3 text-center text-sm-left" + (props.className ? props.className : "") }>
        {props.header || props.description || props.link ? <div className="card-body">
            {props.header ? <h5 className="card-title">{props.header}</h5> : null}
            {props.description ? <p className="card-text">{props.description}</p> : null}
            {props.link ? <NavLink to={props.link.url} className="btn btn-primary">
                {props.link.text}
            </NavLink> : null}
        </div> : null}
    </div>
};


export default Hall;