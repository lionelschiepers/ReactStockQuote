import React from "react";
import { Container, Row, Col } from "reactstrap";

import Highlight from "../Components/Highlight";
import Loading from "../Components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

export const ProfileComponent = () => {
  const { user } = useAuth0();

  return (
    <Container>
      <Row className="align-items-center profile-header text-center">
        <Col>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture"
          />
        </Col>
        <Col>
          <h2>{user.name}</h2>
          <p className="lead text-muted">{user.email}</p>
        </Col>
      </Row>
      <Row>
        <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
      </Row>
    </Container>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
