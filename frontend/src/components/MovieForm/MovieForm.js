import React, {Component} from 'react'
import axios from "axios";
import {CATEGORIES_URL} from "../../api-urls";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import FormInput from "../UI/FormInput/FormInput";


class MovieForm extends Component {
    constructor(props) {
        super(props);

        const newMovie = {
            name: "",
            description: "",
            release_date: "",
            finish_date: "",
            poster: null,
            categories: []
        };

        this.state = {
            categories: [],
            submitEnabled: true,
            movie: newMovie,
            posterFileName: ""
        };

        if(this.props.movie) {
            this.state.posterUrl = this.props.movie.poster;

            this.state.movie = this.props.movie;

            this.state.movie.poster = null;
        }
    }

    componentDidMount() {
        axios.get(CATEGORIES_URL)
            .then(response => {
                const categories = response.data;
                console.log(categories);
                this.setState(prevState => {
                    let newState = {...prevState};
                    newState.categories = categories;
                    return newState;
                });
            })
            .catch(error => {
                console.log(error);
                console.log(error.response)
            });
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

    dateToObject = (date) => {
        return date ? new Date(date) : null;
    };

    getCategoryOptions = () => {
        return this.state.categories.map(category => {
            return {value: category.id, label: category.title}
        });
    };

    getCategoryValue = () => {
        if(this.state.categories.length > 0) {
            return this.state.movie.categories.map(id => {
                const category = this.state.categories.find(category => category.id === id);
                return {value: id, label: category.title};
            });
        }
        return [];
    };

    updateMovieState = (fieldName, value) => {
        this.setState(prevState => {
            let newState = {...prevState};
            let movie = {...prevState.movie};
            movie[fieldName] = value;
            newState.movie = movie;
            return newState;
        });
    };

    inputChanged = (event) => {
        const value = event.target.value;
        const fieldName = event.target.name;
        this.updateMovieState(fieldName, value);
    };

    dateChanged = (field, date) => {
        this.updateMovieState(field, date.toISOString().slice(0, 10));
    };

    selectChanged = (field, values) => {
        const category_ids = values.map(item => item.value);
        this.updateMovieState(field, category_ids);
    };

    fileChanged = (event) => {
        const fileName = event.target.value;
        const fieldName = event.target.name;
        const fileObject = event.target.files.length > 0 ? event.target.files[0] : null;
        this.updateMovieState(fieldName, fileObject);
        this.setState(prevState => {
            let newState = {...prevState};
            newState[fieldName + 'FileName'] = fileName;
            return newState;
        });
    };

    submitForm = (event) => {
        if(this.state.submitEnabled) {
            event.preventDefault();
            this.disableSubmit();
            this.props.onSubmit(this.state.movie)
                .then(this.enableSubmit);
        }
    };

    showErrors = (name) => {
        if(this.props.errors && this.props.errors[name]) {
            return this.props.errors[name].map((error, index) => <p className="text-danger" key={index}>{error}</p>);
        }
        return null;
    };

    render() {
        if (this.state.movie) {
            const {name, description, release_date, finish_date} = this.state.movie;
            const {posterFileName, submitEnabled} = this.state;

            const releaseDateSelected = this.dateToObject(release_date);
            const finishDateSelected = this.dateToObject(finish_date);

            const selectOptions = this.getCategoryOptions();

            const selectValue = this.getCategoryValue();

            const errors = this.props.errors;

            return <div>
                <form onSubmit={this.submitForm}>
                    {this.showErrors('non_field_errors')}
                    <FormInput onChange={this.inputChanged} value={name} name="name" label={"Название"}
                               errors={errors['name']}/>
                    <div className="form-group">
                        <label>Описание</label>
                        <textarea className="form-control" name="description" value={description}
                                  onChange={this.inputChanged}>value={description}</textarea>
                        {this.showErrors('description')}
                    </div>
                    <div className="form-group">
                        <label className="font-weight-bold">Дата выхода</label>
                        <div>
                            <DatePicker dateFormat="yyyy-MM-dd" selected={releaseDateSelected}
                                        className="form-control"
                                        name="release_date"
                                        onChange={(date) => this.dateChanged('release_date', date)}/>
                        </div>
                        {this.showErrors('release_date')}
                    </div>
                    <div className="form-group">
                        <label>Дата завершения проката</label>
                        <div>
                            <DatePicker dateFormat="yyyy-MM-dd" selected={finishDateSelected} className="form-control"
                                        name="finish_date" onChange={(date) => this.dateChanged('finish_date', date)}/>
                        </div>
                        {this.showErrors('finish_date')}
                    </div>
                    <div className="form-group">
                        <label>Постер</label>
                        <div>
                            <input type="file" name="poster" value={posterFileName} onChange={this.fileChanged}/>
                            {this.state.posterUrl ? <a href={this.state.posterUrl}>Текущий файл</a> : null}
                        </div>
                        {this.showErrors('poster')}
                    </div>
                    <div className="form-group">
                        <label>Категории</label>
                        <Select options={selectOptions} isMulti={true} name='categories' value={selectValue}
                                onChange={(values) => this.selectChanged('categories', values)}/>
                        {this.showErrors('categories')}
                    </div>
                    <button disabled={!submitEnabled} type="submit"
                            className="btn btn-primary">Сохранить
                    </button>
                </form>
            </div>;
        }
    }
}


export default MovieForm;