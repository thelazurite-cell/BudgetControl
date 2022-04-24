import "./css/App.css";
import Login from "./Login.js";
import Nav from "./Nav.js";
import Settings from "../settings/Settings.js";
import Landing from "../dashboard/Landing.js";
import Transactions from "../transactions/Transactions.js";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ProvideAuth } from "../auth/Auth.js";
import { PrivateRoute } from "../auth/PrivateRoute";
import { ProvideSensitiveData } from "../SensitiveData";
import { Content } from "@carbon/react";
import { GlobalTheme } from "@carbon/react";

function App() {
  return (
    <GlobalTheme theme="g100">
      <ProvideAuth>
        <ProvideSensitiveData>
          <Router>
            <div>
              <Nav />
              {/* <div className="App">
            <div className="main-container">
              <div className="main-content"> */}
              <Content id="main-content">
                <Switch>
                  <Route path="/login">
                    <Login />
                  </Route>
                  <PrivateRoute path="/settings/">
                    <Settings />
                  </PrivateRoute>
                  <PrivateRoute path="/transactions">
                    <Transactions />
                  </PrivateRoute>
                  <PrivateRoute index path="/">
                    <Landing />
                  </PrivateRoute>
                </Switch>
              </Content>
              {/* </div>
            </div>
          </div> */}
            </div>
          </Router>
        </ProvideSensitiveData>
      </ProvideAuth>
    </GlobalTheme>
  );
}

export default App;
