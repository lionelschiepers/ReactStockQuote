import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "reactstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { AppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { reactPlugin } from "./AppInsights";

import Loading from "./Components/Loading";
import NavBar from "./Components/NavBar";

import Home from "./views/Home";
import Profile from "./views/Profile";

import "./App.css";

function App() {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AppInsightsContext.Provider value={reactPlugin}>
      <BrowserRouter>
        <div id="app" className="d-flex flex-column">
          <NavBar />
          <Container fluid className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="profile" element={<Profile />} />
            </Routes>
          </Container>
        </div>
      </BrowserRouter>
    </AppInsightsContext.Provider>
  );
}

export default App;