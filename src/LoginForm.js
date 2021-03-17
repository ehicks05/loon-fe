import React, { useState } from "react";
import superFetch from "./common/SuperFetch";
import { useUserStore, fetchUser } from "./common/UserContextProvider";

function LoginForm() {
  const user = useUserStore((state) => state.user);

  const [failureMessage, setFailureMessage] = useState("");

  function login(e) {
    e.preventDefault();
    const formElement = document.getElementById("loginForm");
    const formData = new FormData(formElement);

    setFailureMessage("");

    superFetch(
      "/login",
      {
        method: "POST",
        body: new URLSearchParams(formData),
      },
      false
    ).then((response) => {
      if (response?.status !== 200)
        setFailureMessage("Invalid username and/or password");
      fetchUser();
    });
  }

  return (
    <div>
      {!user && (
        <form method="POST" action="/" id="loginForm" onSubmit={login}>
          <div className="field">
            <div className="control">
              <input
                className="input"
                type="email"
                placeholder="Email"
                id="username"
                name="username"
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <input
                className="input"
                type="password"
                placeholder="Password"
                id="password"
                name="password"
                autoComplete="password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="button is-block is-primary is-fullwidth"
          >
            Log in
          </button>
        </form>
      )}

      {!user && failureMessage && (
        <>
          <div className="has-text-danger">{failureMessage}</div>
        </>
      )}
    </div>
  );
}

export default LoginForm;
