import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const SignUp = ({ url }) => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    name: "",
    age: 0,
    gender: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signUp = async (e) => {
    e.preventDefault();
    const signUpRes = await fetch(`${url}/api/users/signUp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...user,
      }),
    });

    const signUpData = await signUpRes.json();
    if (signUpData.status == 201) {
      sessionStorage.setItem("token", signUpData.token);
      localStorage.setItem("userID", signUpData.user._id);
      navigate("/chat");
    } else setError(signUpData.message);
  };

  return (
    <>
      <form onSubmit={signUp}>
        <p>{error}</p>
        <label>
          Name
          <input
            type="text"
            value={user.name}
            placeholder="Enter Name"
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </label>
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
          <input
            type="password"
            value={user.password}
            placeholder="Enter Password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </label>
        <label>
          Age
          <input
            type="number"
            max={110}
            value={user.age}
            placeholder="Enter Age"
            onChange={(e) => setUser({ ...user, age: e.target.value })}
          />
        </label>
        <label>
          Gender
          <select
            name=""
            id=""
            defaultValue="select"
            onChange={(e) => setUser({ ...user, gender: e.target.value })}
          >
            <option value="select" disabled>
              Select
            </option>
            <option value="male">male</option>
            <option value="female">female</option>
            <option value="other">other</option>
          </select>
        </label>
        <label>
          Bio
          <textarea
            type="text"
            value={user.bio}
            placeholder="Enter Bio"
            onChange={(e) => setUser({ ...user, bio: e.target.value })}
          />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
};
SignUp.propTypes = {
  url: PropTypes.string.isRequired,
};
export default SignUp;
