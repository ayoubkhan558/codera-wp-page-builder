import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Import only if we have global styles, but we are using admin.css mainly.
// We can assume admin.css is loaded by WP.

const rootElement = document.getElementById('codera-app');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
