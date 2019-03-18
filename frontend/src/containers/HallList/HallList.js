import React, {Fragment, Component} from 'react';
import {HALLS_URL} from "../../api-urls"
import axios from 'axios';
import HallCard from "../../components/HallCard/HallCard";


class HallList extends Component {
    state = {
        halls: []
    };

    componentDidMount() {
        axios.get(HALLS_URL)
            .then(response => {console.log(response.data); return response.data;})
            .then(halls => this.setState({halls}))
            .catch(error => console.log(error));
    }


    render() {
        return <Fragment>
            <div className='row'>
            {this.state.halls.map(hall => {
               return <div className='col-xs-12 col-sm-6 col-lg-4 mt-3' key={hall.id}>
                   <HallCard hall={hall}/>
               </div>
            })}
            </div>
        </Fragment>
    }
}

export default HallList;