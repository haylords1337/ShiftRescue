import axios from "axios";

const companytoken = {
  get: () => localStorage.getItem("companytoken"),
  set: companytoken => localStorage.setItem("companytoken", companytoken),
  clear: () => localStorage.removeItem("companytoken"),
  payload: () => {
    return companytoken.get();
  }
};

// Interceptor middleware for axios that adds auth token to headers.

export const getShifts = email => {
  const companycode = companytoken.payload();
  return axios.post("/api/grabshift", { companycode, email }).then(res => {
    const shift = res.map(shift => {
      const enddate = shift.ed;
      const startdate = shift.sd;
      shift.startDate = new Date(
        startdate.year,
        startdate.month,
        startdate.day,
        startdate.hour,
        startdate.min
      );
      shift.endDate = new Date(
        enddate.year,
        enddate.month,
        enddate.day,
        enddate.hour,
        enddate.min
      );
      delete shift.sd;
      delete shift.ed;
      return shift;
    });
    return shift;
  });
};
