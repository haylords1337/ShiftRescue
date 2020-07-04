import React from "react";
import { useAuth } from "../utils/auth";
import Nav from "../components/Nav";
import Schedule from "../components/Schedules";
import { EmployeeProvider } from "../utils/getemploy";
import { TextForm } from "../components/TextField";

const Bosshome = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <Nav firstName={user.firstName} lastName={user.lastName} />
      <div className="jumbotron vw-100 align-items-center">
        <div className="container">
          <div className="above-list">
            <h1 className="h3"> Hey {user && user.firstName}</h1>
            <p>Welcome to the Thunder Dome!</p>
            <br />
            <p>Here are your employees:</p>
          </div>
          <EmployeeProvider>
            <Schedule />
          </EmployeeProvider>
          <button className="btn btn-primary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      <TextForm />
    </div>
  );
};

export default Bosshome;
