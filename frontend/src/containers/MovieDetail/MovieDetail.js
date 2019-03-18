import React, {Component} from 'react';
import {MOVIES_URL, SHOWS_URL} from "../../api-urls";
import {NavLink} from "react-router-dom";
import MovieCategories from "../../components/MovieCategories/MovieCategories"
import axios from 'axios';
import moment from 'moment';
import ShowSchedule from "../../components/ShowSchedule/ShowSchedule";

const movie = {
    movie: null,
    shows: null
};

class MovieDetail extends Component {
    state = movie;

    componentDidMount(props) {
        const match = this.props.match;

        axios.get(MOVIES_URL + match.params.id)
            .then(response => {
                console.log(response.data);
                return response.data;
            })
            .then(movie => {
                this.setState({movie});

                this.loadShows(movie.id);
            })
            .catch(error => console.log(error));
    }

    loadShows = (movieId) => {
        const startsAfter = moment().format('YYYY-MM-DD HH:mm');
        const startsBefore = moment().add(3, 'days').format('YYYY-MM-DD');

        const query = encodeURI(`movie_id=${movieId}&start_time=${startsAfter}&finish_time=${startsBefore}`);
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

    movieDeleted = (movieId) => {
        axios.delete(MOVIES_URL + movieId + '/')
            .then(response => {
                console.log(response.data, 'response');
                this.setState(movie);
                this.props.history.replace('/movies/');
            }).catch(error => {
            console.log(error);
        })
    };


    render() {
        console.log(this.state);
        if (!this.state.movie) return null;

        const {name, categories, description, poster, release_date, finish_date, id} = this.state.movie;

        return <div className="mt-3">
            {poster ? <div className='text-center'>
                <img alt='*' src={poster} className="img-fluid rounded"/>
            </div> : null}

            <h1>{name}</h1>

            {categories.length > 0 ? <MovieCategories categories={categories}/> : null}

            <p className="text-secondary">В прокате
                с: {release_date} до: {finish_date ? finish_date : "Неизвестно"} </p>

            {description ? <p>{description}</p> : null}

            <NavLink to={'/movies/' + id + '/edit'} className="btn btn-primary mr-2">Редактировать</NavLink>

            <button type="button" className="btn btn-danger py-0 px-2" onClick={() => this.movieDeleted(id)}>Удалить</button>

            {this.state.shows ? <ShowSchedule shows={this.state.shows}/> : null}
        </div>;

    }
}

export default MovieDetail;