// import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

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
    <BrowserRouter>
      <div id="app" className="flex flex-col min-h-screen">
        <NavBar />
        <div className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;