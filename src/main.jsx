import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import './index.scss';

ReactDOM.createRoot(document.getElementById('main')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);