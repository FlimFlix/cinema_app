import React from 'react'


const FormInput = (props) => {
    return <div className="form-group">
        <label className="font-weight-bold">{props.label}</label>
        <input type="text" className="form-control" name={props.name} value={props.value}
               onChange={props.onChange}/>
    </div>
};


export default FormInput;