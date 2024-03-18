import React, { useRef, useState } from "react";
import "./Login.css";
import { validator } from "../utils/validator";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isErrorMessage, setIsErrorMessage] = useState(null);

  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const navigate = useNavigate();
  const handleSignInToggle = () => {
    setIsSignIn(!isSignIn);
  };

  const handleSubmit = async () => {
    const message = validator(email.current.value, password.current.value);
    setIsErrorMessage(message);
    if (message) return;

    if (isSignIn) {
      //sign in logic
      const data = await fetch("http://localhost:4002/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.current.value,
          password: password.current.value,
        }),
      });
      const json = await data.json();
      localStorage.setItem("auth", json.token);
      console.log(json);
      navigate("/dashboard");
    } else {
      //sign up logic
      const data = await fetch("http://localhost:4002/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.current.value,
          email: email.current.value,
          password: password.current.value,
        }),
      });
      const json = await data.json();
      localStorage.setItem("auth", json.token);
      console.log(json);
      navigate("/dashboard");
    }
  };
  return (
    <div className="signup-container">
      <form onSubmit={(e) => e.preventDefault()} className="">
        <h1>{isSignIn ? "Sign In" : "Sign Up"}</h1>
        {!isSignIn && (
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input ref={name} type="text" required />
          </div>
        )}

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input ref={email} type="email" required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input ref={password} type="password" required />
        </div>
        <p className="">{isErrorMessage}</p>
        <button className="" onClick={handleSubmit}>
          {isSignIn ? "Sign In" : "Sign Up"}
        </button>

        <div className="" onClick={handleSignInToggle}>
          {isSignIn ? (
            <p>
              New User?
              <span className=""> Sign Up now</span>
            </p>
          ) : (
            <p>
              Already registered
              <span className=""> Sign In now</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
