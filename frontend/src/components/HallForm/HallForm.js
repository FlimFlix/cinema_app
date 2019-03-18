import React, {Component} from 'react'
import axios from "axios";
import {HALLS_URL} from "../../api-urls";


class HallForm extends Component {
    constructor(props) {
        super(props);

        const newHall = {
            title: "",
            description: "",
        };

        this.state = {
            submitEnabled: true,
            hall: newHall,
        };

        if(this.props.hall) {
            this.state.hall = this.props.hall;
        }
    }

    disableSubmit = () => {
        this.setState(prevState => {
            let newState = {...prevState};
            newState.submitEnabled = false;
            return newState;
        });
    };

    enableSubmit = () => {
        this.setState(prevState => {
            let newState = {...prevState};
            newState.submitEnabled = true;
            return newState;
        });
    };

    updateHallState = (fieldName, value) => {
        this.setState(prevState => {
            let newState = {...prevState};
            let hall = {...prevState.hall};
            hall[fieldName] = value;
            newState.hall = hall;
            return newState;
        });
    };

    inputChanged = (event) => {
        const value = event.target.value;
        const fieldName = event.target.name;
        this.updateHallState(fieldName, value);
    };

    componentDidMount() {
        axios.get(HALLS_URL)
            .then(response => {
                const halls = response.data;
                console.log(halls);
                this.setState(prevState => {
                    let newState = {...prevState};
                    newState.halls = halls;
                    return newState;
                });
            })
            .catch(error => {
                console.log(error);
                console.log(error.response)
            });
    }

    submitForm = (event) => {
        if(this.state.submitEnabled) {
            event.preventDefault();
            this.disableSubmit();
            this.props.onSubmit(this.state.hall)
                .then(this.enableSubmit);
        }
    };

    render() {
        if (this.state.hall) {
            const {title, description} = this.state.hall;

            const {submitEnabled} = this.state;

            return <div>
                <form onSubmit={this.submitForm}>
                    <div className="form-group">
                        <label className="font-weight-bold">Название</label>
                        <input type="text" className="form-control" name="title" value={title}
                               onChange={this.inputChanged}/>
                    </div>
                    <div className="form-group">
                        <label>Описание</label>
                        <textarea className="form-control" name="description" value={description}
                                  onChange={this.inputChanged}>value={description}</textarea>
                    </div>
                    <button disabled={!submitEnabled} type="submit"
                            className="btn btn-primary">Сохранить
                    </button>
                </form>
            </div>;
        }
    }
}


export default HallForm;