import React from 'react';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from "@auth0/auth0-react";
// import { createBrowserHistory } from "history";
//import history from "./utils/history";
import { getConfig } from "./config";
import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';

// const history = createBrowserHistory();

const onRedirectCallback = (appState) => {
//  history.push(
//    appState && appState.returnTo ? appState.returnTo : window.location.pathname
//  );
};

// Please see https://auth0.github.io/auth0-react/interfaces/auth0_provider.auth0provideroptions.html
// for a full list of the available properties on the provider
const config = getConfig();

const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  ...(config.audience ? { audience: config.audience } : null),
  authorizationParams: {
    redirect_uri: window.location.origin
  },
//  redirectUri: window.location.origin,
  onRedirectCallback,
};

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
<Auth0Provider {...providerConfig}>
  <App />
</Auth0Provider>,
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
