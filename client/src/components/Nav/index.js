import React from "react";
import "../../styles/style.css";
import { useAuth } from "../../utils/auth";

const Nav = props => {
  const Dropdown = () => {
    const { user, logout } = useAuth();

    if (user) {
      return (
        <div clasName="nav-item btn-group">
          <button
            type="button"
            className="btn btn-success dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Menu
          </button>
          <div className="dropdown-menu dropdown-menu-right">
            <button className="dropdown-item" type="button">
              Account
            </button>
            <button className="dropdown-item" type="button">
              Rescue Shift
            </button>
            <div role="separator" clasName="dropdown-divider"></div>
            <button
              className="dropdown-item logout"
              type="button"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      );
    }
  };
  return (
    <nav className="navbar navbar bg">
      <span className="navbar-brand mb-0 h1">
        Welcome to ShiftRescue {props.firstName} {props.lastName}
      </span>
      <div> {Dropdown()}</div>
    </nav>
  );
};

export default Nav;
