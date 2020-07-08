import axios from "axios";
import React, { useContext, createContext, useReducer, useEffect } from "react";
const initialShiftState = {
  data: "",
  currentViewName: "Month",
  addedAppointment: {},
  appointmentChanges: {},
  editingAppointmentId: undefined
};
const defaultShiftValue = {
  ...initialShiftState,
  createshift: () => {}
};
const ShiftContext = createContext(defaultShiftValue);

const shiftReducer = (state, action) => {
  return {
    ...state,
    data: action.shift
  };
};

export const calendarProvider = props => {
  const [state, dispatch] = useReducer(shiftReducer, initialShiftState);

  const createshift = () => {
    return axios.post("/api/createshift").then(shift => dispatch(shift));
  };

  const value = {
    ...state,
    createshift
  };
  return <ShiftContext.Provider value={value} {...props} />;
};

export const useGather = () => {
  return useContext(ShiftContext);
};
