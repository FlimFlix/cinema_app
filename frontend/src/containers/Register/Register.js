import React, {Component, Fragment} from 'react';
import {REGISTER_URL} from "../../api-urls";
import axios from 'axios';


class Register extends Component {
    state = {
        user: {
            username: "",
            password: "",
            passwordConfirm: "",
            email: "",
        },
        errors: {}
    };

    formSubmitted = (event) => {
        event.preventDefault();
        const {passwordConfirm, ...restData} = this.state.user;
        return axios.post(REGISTER_URL, restData).then(response => {
            console.log(response);
            this.props.history.replace({
                pathname: '/login/',
                state: {next: '/'}
            });
        }).catch(error => {
            console.log(error);
            console.log(error.response);
            this.setState({
                ...this.state,
                errors: error.response.data
            })
        });
    };

    inputChanged = (event) => {
        this.setState({
            ...this.state,
            user: {
                ...this.state.user,
                [event.target.name]: event.target.value
            }
        })
    };

    passwordConfirmChange = (event) => {
        this.inputChanged(event);
        const passwordConfirm = event.target.value;
        if(passwordConfirm !== this.state.user.password) {
            this.setState({
                errors: {
                    ...this.state.errors,
                    passwordConfirm: ['Пароли не совпадают']
                }
            })
        } else {
            this.setState({
                errors: {
                    ...this.state.errors,
                    passwordConfirm: []
                }
            })
        }
    };

    showErrors = (name) => {
        if(this.state.errors && this.state.errors[name]) {
            return this.state.errors[name].map((error, index) => <p className="text-danger" key={index}>{error}</p>);
        }
        return null;
    };

    render() {
        const {username, password, passwordConfirm, email} = this.state.user;
        return <Fragment>
            <h2>Регистрация</h2>
            <form onSubmit={this.formSubmitted}>
                {this.showErrors('non_field_errors')}
                <div className="form-row">
                    <label className="font-weight-bold">Имя пользователя</label>
                    <input type="text" className="form-control" name="username" value={username}
                           onChange={this.inputChanged}/>
                    {this.showErrors('username')}
                </div>
                <div className="form-row">
                    <label className="font-weight-bold">Пароль</label>
                    <input type="password" className="form-control" name="password" value={password}
                           onChange={this.inputChanged}/>
                    {this.showErrors('password')}
                </div>
                <div className="form-row">
                    <label className="font-weight-bold">Подтверждение пароля</label>
                    <input type="password" className="form-control" name="passwordConfirm" value={passwordConfirm}
                           onChange={this.passwordConfirmChange}/>
                    {this.showErrors('passwordConfirm')}
                </div>
                <div className="form-row">
                    <label>E-mail</label>
                    <input type="email" className="form-control" name="email" value={email}
                           onChange={this.inputChanged}/>
                    {this.showErrors('email')}
                </div>
                <button type="submit" className="btn btn-primary mt-2">Зарегистрироваться</button>
            </form>
        </Fragment>
    }
}


export default Register;