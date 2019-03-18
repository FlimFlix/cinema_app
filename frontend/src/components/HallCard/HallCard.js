import React from 'react';
import Hall from '../UI/Hall/Hall'

const HallCard = props => {
    const {hall} = props;

    const {title, id} = hall;

    const link = {
        text: 'Посмотреть зал',
        url: '/halls/' + id
    };

    return <Hall header={title} link={link}/>
};

export default HallCard;