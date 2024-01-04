import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const LogIn = ({ url }) => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const logIn = async (e) => {
    e.preventDefault();
    const logInResults = await fetch(`${url}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...user,
      }),
    });
    const resJson = await logInResults.json();
    if (resJson.status == 200) {
      sessionStorage.setItem("token", resJson.token);
      localStorage.setItem("userID", resJson.user._id);
      navigate("/chat");
    } else {
      setError(resJson.message);
      //create error with message
    }
  };

  return (
    <div>
      <form onSubmit={logIn}>
        <label>
          Email
          <input
            type="email"
            value={user.email}
            placeholder="Enter Email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </label>
        <label>
          Password
          <p>{error}</p>
          <input
            type="password"
            value={user.password}
            placeholder="Enter Password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </label>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};
LogIn.propTypes = {
  url: PropTypes.string.isRequired,
};
export default LogIn;
