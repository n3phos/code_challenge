/**
 * Created by nephos on 18.08.18.
 */
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from "react-redux";
import  AppStore  from './store';
import { createApp } from './app';

const App = createApp();

export const createRoot = (store = AppStore, name = 'Root') => {
    class Root extends Component {
        render() {
            return (
                <Provider store={store}>
                    < App />
                </Provider>
            )
        }
    }

    Root.displayName = name;

    return Root
};
