import React, {Component, Fragment} from 'react'
import {REGISTER_ACTIVATE_URL} from "../../api-urls";
import axios from 'axios';


class RegisterActivate extends Component {
    state = {
        error: null,
    };

    componentDidMount() {
        const urlParams = new URLSearchParams(this.props.location.search);
        if (urlParams.has('token')) {
            const data = {token: urlParams.get('token')};
            axios.post(REGISTER_ACTIVATE_URL, data).then(response => {
                console.log(response);
                localStorage.setItem('auth-token', response.data.token);
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('is_admin', response.data.is_admin);
                localStorage.setItem('is_staff', response.data.is_staff);
                this.props.history.replace('/');
            }).catch(error => {
                console.log(error);
                console.log(error.response);
                this.setState({error: error.response.data.token[0], success: null});
            })
        }
    }

    render() {
        const urlParams = new URLSearchParams(this.props.location.search);
        return <Fragment>
            <h2 className="mt-3">Активация пользователя</h2>
            {urlParams.has('token') ? <Fragment>
                {this.state.error ? <Fragment>
                    <p>Во время активации произошла ошибка:</p>
                    <p className="text-danger">{this.state.error}</p>
                    <p>Попробуйте позже или обратитесь к администратору сайта.</p>
                </Fragment> :  <p>Подтверждается активация, подождите...</p>}
            </Fragment> : <Fragment>
                <p>На вашу почту, указанную при регистрации, было выслано письмо для подтверждения регистрации.</p>
                <p>Для продолжения перейдите по ссылке активации, указанной в письме.</p>
            </Fragment>}
        </Fragment>

    }

}

export default RegisterActivate