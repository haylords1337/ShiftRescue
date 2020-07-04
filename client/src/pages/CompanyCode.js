import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";

import { useAuth } from "../utils/auth";
import FullPageSpinner from "../components/FullPageSpinner";
import LoginAlert from "../components/LoginAlert";
import { CompanyCodeInputGroup } from "../components/FormControls";

const Company = () => {
  const { companyVerify, isPending, isaCompany, isBoss, error } = useAuth();
  const [companycode, setCompanycode] = useState("");
  const handleSubmit = e => {
    e.preventDefault();
    companyVerify(companycode);
  };

  if (isaCompany) {
    return <Redirect to="/signup" />;
  }

  if (isPending) {
    return <FullPageSpinner text="Verifying account..." />;
  }

  return (
    <div className="container vh-100 text-center d-flex align-items-center flex-column">
      <form className="form-login m-auto" onSubmit={handleSubmit}>
        <h1 className="h3 mb-3 font-weight-normal">
          Please Enter Your Company Code
        </h1>
        <CompanyCodeInputGroup
          required
          value={companycode}
          onChange={e => setCompanycode(e.target.value)}
        />
        <button type="submit" className="my-3 btn btn-lg btn-primary btn-block">
          Check Code
        </button>
        <div>
          <Link to="/login">Return to Login</Link>
        </div>
        {error && <LoginAlert error={error} />}
      </form>
    </div>
  );
};

export default Company;
