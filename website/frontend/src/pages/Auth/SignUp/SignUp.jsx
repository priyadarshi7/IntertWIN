import React from 'react';
import './SignUp.css'; 
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../context/UserContext';
import axios from 'axios';
import RING from "vanta/src/vanta.rings"


const SignUp = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();

  const [data, setData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  
  React.useEffect(()=>{
    RING({
        el:"#signup",
        backgroundColor:0x0,
        touchControls:true,
    })
},[]);

  const [error, setError] = React.useState("");

  // Log updated user whenever it changes
  React.useEffect(() => {
    console.log("Updated user:", user);
  }, [user]);

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setError("");

    if (!data.name) {
      setError("Name is required");
      return;
    }

    if (!data.email) {
      setError("Email is required");
      return;
    }

    if (!data.password) {
      setError("Password is required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/user/signup", data, { withCredentials: true });
      
      if (response.data.success) {
        console.log("Response data:", response.data.data);
        
        setUser({
          userId: response.data.data.userId,
          name: response.data.data.name,
          email: response.data.data.email,
        });
        navigate("/user/login");
      } else {
        setError("Signup failed");
      }
      setData({ name: "", email: "", password: "" });
    } catch (err) {
      setError("An error occurred during signup");
      console.error("Signup error:", err);
    }
  };

  return (
    <div id="signup" style={{height:"100svh"}}>
    <div className="container">
      <input type="checkbox" id="check" />
      <div className="login form">
        <header>Sign Up</header>
        <form onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Enter your username"
            name="name"
            onChange={changeHandler}
            value={data.name}
          />
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            onChange={changeHandler}
            value={data.email}
          />
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            onChange={changeHandler}
            value={data.password}
          />
          <input
            type="submit"
            className="button"
            value="Sign Up"
            style={{backgroundColor:"#f93f85"}}
          />
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="signup">
          <span>Already have an account? 
            <label htmlFor="check">
              <a href="/user/login" style={{color:"#f93f85"}}>Login</a>
            </label>
          </span>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SignUp;
