import React from 'react';
import ReactDOM from 'react-dom';

import { createRoot } from './root';

const RootComponent = createRoot();

ReactDOM.render(
    <RootComponent />,
    document.getElementById('app')
);

//module.hot.accept();
