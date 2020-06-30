import React from "react";
import axios from "axios";

const chkavail = () => {
  return axios.get("/api/allemployees").then(res => res.data);
};
