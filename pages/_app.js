import '../src/index.css';
import '../src/Components/YahooFinance.css';

import { Auth0Provider } from "@auth0/auth0-react";
import { getConfig } from "../src/config";
import NavBar from "../src/Components/NavBar";
import { useState, useEffect } from 'react';

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
  const [darkMode, setDarkMode] = useState(false);

  // Check for saved theme preference or default to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark';
    
    // Set initial dark mode state and class immediately
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Auth0Provider {...providerConfig}>
      <div id="app" className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
        <NavBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="grow bg-white dark:bg-gray-900">
          <Component {...pageProps} />
        </div>
      </div>
    </Auth0Provider>
  );
}

export default MyApp;