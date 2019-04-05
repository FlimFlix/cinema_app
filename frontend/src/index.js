import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import {createStore, applyMiddleware} from 'redux';
import reducer from './store/reducer';
import {Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';


// TODO: убрать, как только все запросы 'переедут' в login.js
import axios from 'axios';

import {BASE_URL} from "./api-urls";

axios.defaults.baseURL = BASE_URL;

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

ReactDOM.render(<Provider store={store}><App /></Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
