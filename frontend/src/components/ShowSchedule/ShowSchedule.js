import React from 'react'
import moment from "moment";

const formatDate = (dateString) => {
    return moment(dateString).format('YYYY-MM-DD HH:mm')
};

const ShowSchedule = props => {
    return <div className="mt-4">
        <h2>Расписание показов</h2>
        {props.shows.map(show => {
            return <p key={show.id}>{formatDate(show.start_time)}, {show.hall_name}</p>
        })}
    </div>
};


export default ShowSchedule