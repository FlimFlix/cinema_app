import React, {Fragment, Component} from 'react';
import {MOVIES_URL} from "../../api-urls"
import MovieCard from "../../components/MovieCard/MovieCard";
import axios from 'axios';


class MovieList extends Component {
    state = {
        movies: []
    };

    componentDidMount() {
        axios.get(MOVIES_URL)
            .then(response => {console.log(response.data); return response.data;})
            .then(movies => this.setState({movies}))
            .catch(error => console.log(error));
    }


    render() {
        return <Fragment>
            <div className='row'>
            {this.state.movies.map(movie => {
               return <div className='col-xs-12 col-sm-6 col-lg-4 mt-3' key={movie.id}>
                   <MovieCard movie={movie}/>
               </div>
            })}
            </div>
        </Fragment>
    }
}

export default MovieList;