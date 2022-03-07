import React, { Fragment } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Content from "../Components/Content";

const Home = () => {
  const { isAuthenticated } = useAuth0();

  return <Fragment>{isAuthenticated && <Content />}</Fragment>;
};

export default Home;
