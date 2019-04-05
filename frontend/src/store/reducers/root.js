import {combineReducers} from 'redux';
import loginReducer from "./login";
import authReducer from "./auth";
import registerReducer from "./register";
import tokenLoginReducer from "./app";
import movieListReducer from "./movie-list";
import movieEditReducer from "./movie-edit";


const rootReducer = combineReducers({
    login: loginReducer,
    register: registerReducer,
    auth: authReducer,
    app: tokenLoginReducer,
    movieList: movieListReducer,
    movieEdit: movieEditReducer
});

export default rootReducer;