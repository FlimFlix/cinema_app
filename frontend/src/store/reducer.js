import {LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_ERROR} from "./actions/login";
import {LOGOUT} from "./actions/logout";
import {TOKEN_LOGIN_REQUEST, TOKEN_LOGIN_SUCCESS, TOKEN_LOGIN_ERROR} from "./actions/token-login";

const initialState = {
    login: {
        loading: false,
        error: {}
    },
    auth: {},
    app: {
        loading: true,
        errors: {}
    },
    // register: {
    //
    // },
    // movieList: {
    //
    // },
    // movieDetail: {
    //
    // },
    // movieAdd: {
    //
    // },
    // movieEdit: {
    //
    // }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                login: {
                    ...state.login,
                    errors: {},
                    loading: true
                }
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                login: {
                    ...state.login,
                    loading: false,
                },
                auth: action.data
            };
        case LOGIN_ERROR:
            return {
                ...state,
                login: {
                    ...state.login,
                    loading: false,
                    errors: action.errors
                }
            };
        case LOGOUT:
            return {
                ...state,
                auth: {}
            };
        case TOKEN_LOGIN_REQUEST:
            return {
                ...state,
                app: {
                    ...state.app,
                    loading: true,
                    errors: {}
                }
            };
        case TOKEN_LOGIN_SUCCESS:
            return {
                ...state,
                app: {
                    ...state.app,
                    loading: false,
                },
                auth: action.data
            };
        case TOKEN_LOGIN_ERROR:
            return {
                ...state,
                app: {
                    ...state.app,
                    loading: false,
                    errors: action.errors
                }
            };
        default:
            return state;
    }
};

export default reducer;