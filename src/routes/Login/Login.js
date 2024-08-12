import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import Navbar from "../Navbar/Navbar";
import WebSocketService from "../../WebSocketService/WebSocketService"; // Import WebSocketService

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting login form...");

      const response = await fetch("http://localhost:8081/api/login", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Login successful");

        try {
          const responseBody = await response.text();
          console.log("Response Body:", responseBody);

          const data = JSON.parse(responseBody);
          console.log("Parsed Data:", data);

          if (data && data.role) {
            // Save id and role in cookies
            Cookies.set('userId', data.userId);
            Cookies.set('userRole', data.role);

            console.log(data.userId);
            console.log(data.role);

            if (data.role === "parent") {
              const name = data.firstName + " " + data.lastName
              Cookies.set('parentName', name )
              Cookies.set('parentId', data.parentId)
              navigate('/homeParent');
            } else if (data.role === "doctor") {
              const name = data.firstName + " " + data.lastName
              Cookies.set('doctorName', name)
              Cookies.set('supervisorId', data.supervisorId)
              console.log(data.supervisorId)
              navigate('/homeDoctor');
            } else {
              setErrorMessage("Unrecognized role or other error");
            }

            // Establish WebSocket connection after successful login
            const webSocketService = new WebSocketService();
            webSocketService.connect();

          } else {
            setErrorMessage("Unrecognized role or other error");
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          setErrorMessage("Unexpected response from the server");
        }
      } else {
        console.error("Login failed");
        setErrorMessage("Username or password is incorrect");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred while logging in");
    }
  };

  return (
    <>
      <Navbar />
      <div className="body-container">
        <div className="background-container">
          <div className="background-image-1"></div>
          <div className="background-image-2"></div>
        </div>
        <div className="auth-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Username"
              id="username"
              name="username"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              id="password"
              name="password"
            />

            <button className="login-button" type="submit">
              LOGIN
            </button>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <a className="link-btn" href="/Register" style={{ color: "black" }}>
              You don't have an account? Register here.
            </a>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
