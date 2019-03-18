import React from 'react';
import Card from '../UI/Card/Card'

const MovieCard = props => {
    const {name, poster, id} = props.movie;

    const link = {
        text: 'Read more',
        url: '/movies/' + id
    };

    return <Card header={name} image={poster} link={link}/>
};

export default MovieCard;