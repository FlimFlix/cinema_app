import React, {Component, Fragment} from 'react';
import axios from 'axios';
import {USERS_URL} from "../../api-urls";
import UserForm from "../../components/UserForm/UserForm";
import Modal from "../../components/UI/Modal/Modal";
import {connect} from "react-redux";

class UserSettings extends Component {
    state = {
        user: {},
        edit: false,
        alert: null
    };

    componentDidMount() {
        const userId = this.props.match.params.id;
        axios.get(USERS_URL + userId).then(response => {
            console.log(response);
            this.setState(prevState => {
                return {...prevState, user: response.data};
            });
        }).catch(error => {
            console.log(error);
            console.log(error.response);
        })
    }

    onUserUpdate = (user) => {
        this.setState(prevState => {
            return {
                ...prevState,
                user,
                edit: false,
                alert: {type: 'success', text: 'Данные пользователя успешно обновлены!'}
            };
        });
    };

    toggleEdit = (edit) => {
        this.setState(prevState => {
            return {
                ...prevState,
                edit: edit,
                alert: null
            };
        });
    };

    render() {
        // не забываем конвертировать user_id из localStorage в int для сравнения
        // (по умолчанию всё из localStorage считывается, как строка).
        const currentUserId = this.props.auth.user_id;
        const {username, first_name, last_name, email} = this.state.user;
        const alert = this.state.alert;
        return <Fragment>
            {alert ? <div className={"alert mt-3 py-2 alert-" + alert.type} role="alert">{alert.text}</div> : null}
            <h1 className="mt-3">Личный кабинет</h1>
            {username ? <p>Имя пользователя: {username}</p> : null}
            {first_name ? <p>Имя: {first_name}</p> : null}
            {last_name ? <p>Фамиилия: {last_name}</p> : null}
            {email ? <p>Email: {email}</p> : null}

            {/* весь блок формы выходит только если страница принадлежит текущему пользователю */}
            {/* и данные пользователя (откуда берётся id для сравнения) загрузились. */}
            {currentUserId === this.state.user.id ? <Fragment>
                <div className="my-4">
                    <button className="btn btn-primary" type="button" onClick={() => this.toggleEdit(true)}>Редактировать</button>
                    <Modal show={this.state.edit} cancel={() => this.toggleEdit(false)}>
                        <h2>Редактировать</h2>
                        <UserForm user={this.state.user} onUpdateSuccess={this.onUserUpdate}/>
                    </Modal>
                </div>
            </Fragment> : null}
        </Fragment>;
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);