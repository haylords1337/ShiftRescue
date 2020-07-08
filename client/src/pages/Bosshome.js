import React from "react";
import { useAuth } from "../utils/auth";
import Nav from "../components/Nav";
import Schedule from "../components/Schedules";
import { EmployeeProvider } from "../utils/getemploy";
import { Link } from "react-router-dom";

const Bosshome = () => {
  const { user } = useAuth();

  return (
    <div>
      <Nav firstName={user.firstName} lastName={user.lastName} />
      <div className="jumbotron vw-100 align-items-center">
        <div className="container">
          <div className="above-list">
            <h1 className="h3"> Hey {user && user.firstName}</h1>
            <p>Welcome to the Thunder Dome!</p>
            <br />
          </div>
          <EmployeeProvider>
            <Schedule />
          </EmployeeProvider>
        </div>
        <Link to="/calendar">View Full Calendar</Link>
      </div>
    </div>
  );
};

export default Bosshome;
