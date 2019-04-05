import React, {Component, Fragment} from 'react'
import {REGISTER_ACTIVATE_URL} from "../../api-urls";
import axios from 'axios';


class RegisterActivate extends Component {
    state = {
        error: null,
        success: null
    };

    componentDidMount() {
        const urlParams = new URLSearchParams(this.props.location.search);
        if (urlParams.has('token')) {
            const data = {token: urlParams.get('token')};
            axios.post(REGISTER_ACTIVATE_URL, data).then(response => {
                console.log(response);
                this.setState({error: null, success: true});
                setTimeout(() => this.props.history.replace({pathname: '/login', state: {next: '/'}}), 3000)
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
                {!this.state.success && !this.state.error ? <p>Подтверждается активация, подождите...</p> : null}
                {this.state.success ? <p>Регистрация завершена. Сейчас вы будете перенаправлены на страницу входа.</p> : null}
                {this.state.error ? <Fragment>
                    <p>Во время активации произошла ошибка:</p>
                    <p className="text-danger">{this.state.error}</p>
                    <p>Попробуйте позже или обратитесь к администратору сайта.</p>
                </Fragment> : null}
            </Fragment> : <Fragment>
                <p>На вашу почту, указанную при регистрации, было выслано письмо для подтверждения регистрации.</p>
                <p>Для продолжения перейдите по ссылке активации, указанной в письме.</p>
            </Fragment>}
        </Fragment>

    }

}

export default RegisterActivate