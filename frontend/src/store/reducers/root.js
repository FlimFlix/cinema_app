import {combineReducers} from 'redux';
import loginReducer from "./login";
import authReducer from "./auth";
import tokenLoginReducer from "./app";

const rootReducer = combineReducers({
    login: loginReducer,
    auth: authReducer,
    app: tokenLoginReducer
});

export default rootReducer;