import {LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_ERROR} from "./actions/login";
import {LOGOUT} from "./actions/logout";

const initialState = {
    login: {
        loading: false,
        error: {}
    },
    auth: {},
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
        default:
            return state;
    }
};

export default reducer;