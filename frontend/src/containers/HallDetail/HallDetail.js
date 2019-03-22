import React, {Component} from 'react';
import {HALLS_URL, SHOWS_URL} from "../../api-urls";
import {NavLink} from "react-router-dom";
import axios from 'axios';
import moment from "moment";
import ShowSchedule from "../../components/ShowSchedule/ShowSchedule";

const hall = {hall: null};

class HallDetail extends Component {
    state = hall;

    loadShows = (hallId) => {
        const startsAfter = moment().format('YYYY-MM-DD HH:mm');
        const startsBefore = moment().add(3, 'days').format('YYYY-MM-DD');

        const query = encodeURI(`hall_id=${hallId}&start_time=${startsAfter}&finish_time=${startsBefore}`);
        axios.get(`${SHOWS_URL}?${query}`).then(response => {
            console.log(response);
            this.setState(prevState => {
                let newState = {...prevState};
                newState.shows = response.data;
                return newState;
            })
        }).catch(error => {
            console.log(error);
            console.log(error.response);
        });
    };


    componentDidMount(props) {
        const match = this.props.match;

        axios.get(HALLS_URL + match.params.id)
            .then(response => {
                console.log(response.data);
                return response.data;
            })
            .then(hall => {
                this.setState({hall});

                this.loadShows(hall.id);
            })
            .catch(error => console.log(error));
    }

    hallDeleted = (hallId) => {
        axios.delete(HALLS_URL + hallId + '/')
            .then(response => {
                console.log(response.data, 'response');
                this.setState(hall);
                this.props.history.replace('/halls/');
            }).catch(error => {
            console.log(error);
        })
    };


    render() {
        if (!this.state.hall) return null;

        const {title, description, id} = this.state.hall;

        return <div>

            <h1>{title}</h1>

            {description ? <p>{description}</p> : null}

            <NavLink to={'/halls/' + id + '/edit'} className="btn btn-primary mr-2">Редактировать</NavLink>

            <button type="button" className="btn btn-danger py-0 px-2" onClick={() => this.hallDeleted(id)}>Удалить</button>


            {this.state.shows ? <ShowSchedule shows={this.state.shows}/> : null}

        </div>;

    }
}

export default HallDetail;