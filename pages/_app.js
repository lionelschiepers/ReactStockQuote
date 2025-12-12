import '../src/index.css';
import '../src/Components/YahooFinance.css';

import { Auth0Provider } from "@auth0/auth0-react";
import { getConfig } from "../src/config";
import NavBar from "../src/Components/NavBar";

const config = getConfig();

const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  ...(config.audience ? { audience: config.audience } : null),
  authorizationParams: {
    redirect_uri: typeof window !== 'undefined' ? window.location.origin : ''
  },
};

function MyApp({ Component, pageProps }) {
  return (
    <Auth0Provider {...providerConfig}>
      <NavBar />
      <Component {...pageProps} />
    </Auth0Provider>
  );
}

export default MyApp;