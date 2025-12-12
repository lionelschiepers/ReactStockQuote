import React from "react";

import Highlight from "../Components/Highlight";
import Loading from "../Components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

export const ProfileComponent = () => {
  const { user } = useAuth0();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center profile-header text-center mb-8">
        <div className="mb-4">
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-full w-32 h-32 object-cover profile-picture"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <div>
        <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
      </div>
    </div>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
