import React from "react";
import { useAuth } from "../utils/auth";
import Nav from "../components/Nav/index";

const Employeehome = () => {
  const { user } = useAuth();

  return (
    <div>
      <Nav firstName={user.firstName} lastName={user.lastName} />
      <div className="jumbotron vh-100 vw-100 d-flex align-items-center">
        <div className="container">
          <h1 className="h3">Hey {user && user.firstName}</h1>
          <div className="container round">
            <h1 className="left-25px">Employee Schedule:</h1>
            <h3 className="name">
              {user.firstName} {user.lastName}
            </h3>
            <h5>Email:</h5>
            <p>{user.email}</p>
            <h5>Phone Number:</h5>
            <p>{user.phoneNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employeehome;
