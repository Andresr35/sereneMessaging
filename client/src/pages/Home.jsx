import { useState } from "react";
import LogIn from "../components/LogIn";
import SignUp from "../components/SignUp";
import PropTypes from "prop-types";

const Home = ({ url }) => {
  const [show, setShow] = useState({
    signup: false,
    login: false,
  });
  return (
    <div className="home">
      <h1>Serene Messaging</h1>
      <h2 onClick={() => setShow({ signup: true, login: false })}>Sign Up</h2>
      {show.signup && <SignUp url={url} />}
      or
      <h2 onClick={() => setShow({ signup: false, login: true })}>Log In</h2>
      {show.login && <LogIn url={url} />}
    </div>
  );
};
Home.propTypes = {
  url: PropTypes.string.isRequired,
};
export default Home;
