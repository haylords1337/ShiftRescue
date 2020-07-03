import axios from "axios";
import decode from "jwt-decode";

const token = {
  get: () => localStorage.getItem("token"),
  set: token => localStorage.setItem("token", token),
  clear: () => localStorage.removeItem("token"),
  payload: () => {
    try {
      return decode(token.get());
    } catch (error) {
      console.log(error);
      return null;
    }
  }
};
const companytoken = {
  get: () => localStorage.getItem("companytoken"),
  set: companytoken => localStorage.setItem("companytoken", companytoken),
  clear: () => localStorage.removeItem("companytoken"),
  payload: () => {
    return companytoken.get();
  }
};

// Interceptor middleware for axios that adds auth token to headers.
export const addAuthHeader = config => {
  const bearerToken = token.get();
  if (bearerToken) {
    config.headers.Authorization = `Bearer ${bearerToken}`;
  }
  return config;
};

export const signup = (email, password, firstName, lastName, phoneNumber) => {
  const company = companytoken.payload();
  return axios.post("/api/users", {
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    company
  });
};

export const login = (email, password, companycode) => {
  return axios
    .post("/auth/login", { email, password, companycode })
    .then(res => {
      token.set(res.data.token);
      companytoken.set(companycode);

      return token.payload();
    });
};

export const logout = () => {
  token.clear();
  companytoken.clear();
};

export const isLoggedIn = () => {
  if (!token.get()) {
    return false;
  }
  return token.payload().exp > Date.now() / 1000;
};

export const companyCheck = company => {
  return axios.post("/api/company", { company }).then(({ data }) => {
    companytoken.set(data.CompanyCode);
    return companytoken.payload();
  });
};

export const user = () => {
  if (isLoggedIn()) {
    const { id } = token.payload();
    return axios.get(`/api/users/${id}`).then(res => {
      return res.data.user;
    });
  }
  return Promise.resolve(null);
};

export const fetchUserData = () => user();
