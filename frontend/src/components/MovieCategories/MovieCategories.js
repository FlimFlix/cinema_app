import React from 'react';
import './MovieCategories.css'


const MovieCategories = (props) => {
    const {categories} = props;
        return <p>{categories.map(
            category => <span key={category.id} className='badge badge-info category-badge'>
                {category.title}
            </span>
        )}</p>;
};


export default MovieCategories;