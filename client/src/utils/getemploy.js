import axios from "axios";
import React, { useContext, createContext, useReducer, useEffect } from "react";
const initialEmployState = [];
const defaultEmployValue = {
  ...initialEmployState
};
const EmployContext = createContext(defaultEmployValue);

const employeeReducer = (state, action) => {
  const employee = action.map(employee => ({
    name: `${employee.firstName} ${employee.lastName}`,
    email: employee.email,
    phone: employee.phoneNumber
  }));
  return {
    ...state,
    employee
  };
};

const allemployees = () => {
  const companycode = localStorage.getItem("companytoken");
  return axios.post("/api/allemployees", { companycode }).then(res => res.data);
};

export const EmployeeProvider = props => {
  const [state, dispatch] = useReducer(employeeReducer, initialEmployState);

  const gatheremployee = () => {
    allemployees().then(employees => {
      dispatch(employees);
    });
  };
  useEffect(gatheremployee, []);

  const value = {
    ...state,
    gatheremployee
  };
  return <EmployContext.Provider value={value} {...props} />;
};

export const useGather = () => {
  return useContext(EmployContext);
};
