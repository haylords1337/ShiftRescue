import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { AuthProvider } from "./utils/auth";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Employeehome from "./pages/Employeehome";
import Bosshome from "./pages/Bosshome";
import Company from "./pages/CompanyCode";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <ProtectedRoute exact path="/employee" onFailureRedirectToPath="/">
            <Bosshome />
          </ProtectedRoute>
          <ProtectedRoute exact path="/boss" onFailureRedirectToPath="/">
            <Bosshome />
          </ProtectedRoute>
          <Route exact path={["/", "/login"]}>
            <Login />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/company">
            <Company />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
