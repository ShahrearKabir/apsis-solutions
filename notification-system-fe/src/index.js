import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';

import AppWrapper from './AppWrapper';
import { Provider } from 'react-redux';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { sessionService, sessionReducer } from 'redux-react-session';
import thunkMiddleware from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom'
import './assets/scss/_login.scss'
import 'bootstrap/dist/css/bootstrap.min.css';

// Add the sessionReducer
const reducer = combineReducers({
  session: sessionReducer
});

const store = createStore(reducer, undefined, compose(applyMiddleware(thunkMiddleware)));
// Init the session service
sessionService.initSessionService(store);

// console.log("STORE", store);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
