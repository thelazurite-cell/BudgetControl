import "./css/Login.css";
import axios from "axios";
import React, { useEffect } from "react";
import { Form } from "@carbon/react";
import { Button } from "@carbon/react";
import { TextInput } from "@carbon/react";
import { AuthCookie } from "../auth/AuthCookie";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../auth/Auth";

function updateUserValue(evt) {
  const val = evt.target.value;
  userProps.username = val;
}

function updatePassValue(evt) {
  const val = evt.target.value;
  userProps.password = val;
}

const additionalProps = {
  className: "login-form",
};

const userProps = {
  username: "",
  password: "",
};

const usernameProps = {
  className: "",
  id: "username",
  name: "username",
  labelText: "Username",
  placeholder: "Username",
};

const passwordProps = {
  className: "",
  id: "password",
  labelText: "Password",
  placeholder: "Password",
};

const loginProps = {
  className: "btn",
};

export default function Login(props) {
  const auth = useAuth();
  console.log(auth);
  const history = useHistory();
  const location = useLocation();
  const authCookie = new AuthCookie();

  useEffect(() => {
    redirect(auth, history, location);
  });

  const login = (e) => {
    e.preventDefault();
    const authAttempt = btoa(userProps.username + ":" + userProps.password);
    console.log(userProps.username + " " + userProps.password);

    axios
      .post("https://192.168.0.21:5001/auth/login", {
        attempt: authAttempt,
      })
      .then((response) => {
        console.log(response.data);

        if (response.data.success) {
          authCookie.clearToken();
          authCookie.setTokenCookie(response.data.result);

          redirect(auth, history, location);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Form {...additionalProps} onSubmit={login}>
      <TextInput
        onChange={(evt) => updateUserValue(evt)}
        required
        {...usernameProps}
      />

      <TextInput
        type="password"
        onChange={(evt) => updatePassValue(evt)}
        required
        {...passwordProps}
      />

      <Button type="submit" className="" {...loginProps}>
        Log in
      </Button>
    </Form>
  );
}

function redirect(auth, history, location) {
  let { from } = location.state || { from: { pathname: "/home" } };
  auth.signin((signedIn) => {
    if (signedIn) {
      history.replace(from);
    } else {
      auth.signout();
    }
  });
}
