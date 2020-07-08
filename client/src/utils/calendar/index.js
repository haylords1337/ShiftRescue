import React, { createContext, useReducer, useContext, useEffect } from "react";
import * as ShiftService from "./shifts";
import {
  ERROR,
  FETCHED_SHIFTS,
  VIEW_NAME,
  CURRENT_DATE,
  VIEW_CHANGE,
  COMPANY_VERIFIED
} from "./actions";

export * from "./shifts";

const initialShiftState = {
  data: null,
  currentViewName: "Month",
  addedAppointment: {},
  appointmentChanges: {},
  editingAppointmentId: undefined
};

const defaultShiftValue = {
  ...initialAuthState,
  getShift: () => {}
};

const ShiftContext = createContext(defaultShiftValue);

const shiftReducer = (state, action) => {
  switch (action.type) {
    case FETCHED_SHIFTS:
      return {
        ...state,
        data: action.shift
      };
    case VIEW_CHANGE:
      return {
        ...state,
        currentViewName: action.target
      };
    case VIEW_NAME:
      return {
        ...state,
        currentViewName
      };
    case CURRENT_DATE:
      return {
        currentDate
      };
  }
};

export const ShiftProvider = props => {
  const [state, dispatch] = useReducer(shiftReducer, initialShiftState);

  const getShift = email => {
    ShiftService.getShifts(email).then(shift =>
      dispatch({ type: FETCHED_SHIFTS, shift })
    );
  };
  useEffect(getShift, []);
  // initialize auth state when auth provider is first mounted
  const currentViewNameChange = e => {
    const target = e.target.value;
    dispatch({ type: VIEW_CHANGE, target });
  };

  const currentDateChange = (currentViewName, currentDate) => {
    if (currentViewName) {
      dispatch({ type: VIEW_NAME });
    } else if (currentDate) {
      dispatch({ type: CURRENT_DATE });
    }
  };

  const signup = (email, password, firstName, lastName, phoneNumber) => {
    dispatch({ type: PENDING });
    const companycode = localStorage.getItem("companytoken");
    AuthService.signup(
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      companycode
    )
      .then(() => login(email, password, companycode))
      .catch(error => {
        dispatch({
          type: ERROR,
          error: "Invalid email and password or account already exists."
        });
      });
  };

  const companyVerify = company => {
    return AuthService.companyCheck(company)
      .then(code => {
        if (company !== null) {
          dispatch({ type: COMPANY_VERIFIED });
        }
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: ERROR,
          error: "Invalid company name"
        });
      });
  };

  const value = {
    ...state,
    login,
    logout,
    signup,
    companyVerify
  };

  return <AuthContext.Provider value={value} {...props} />;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
