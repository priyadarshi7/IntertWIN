import React from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useUserContext } from "../../../context/UserContext";
import "./Login.css";

const Login = () => {
  const { setUser,userData } = useUserContext();
  const navigate = useNavigate();
  const [data, setData] = React.useState({
    email: "",
    password: "",
  });
  const [error, setError] = React.useState("");

  function changeHandler(event) {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!data.email || !data.password) {
      setError("Email and Password are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/user/login", data, { withCredentials: true });
      if (response.data.success) {
        setUser({
          userId: response.data.data.userId,
          name: response.data.data.name,
          email: response.data.data.email,
        });
        navigate("/");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred. Please try again.");
    }

    setData({ email: "", password: "" });
  }

  return (
    <div className="container">
      <div className="login form">
        <header>Login</header>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              name="email"
              onChange={changeHandler}
              value={data.email}
              autoComplete="email" 
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              name="password"
              onChange={changeHandler}
              value={data.password}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <a href="#">Forgot password?</a>
          <input type="submit" className="button" value="Login" />
        </form>
        <div className="signup">
          <span>Don't have an account? 
            <label htmlFor="check"> <a href="/user/signup">Signup</a></label>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
