import LogIn from "../components/LogIn";
import SignUp from "../components/SignUp";
import PropTypes from "prop-types";

const Home = ({ url }) => {
  return (
    <div>
      Login and start chatting!
      <SignUp url={url} />
      or
      <LogIn url={url} />
    </div>
  );
};
Home.propTypes = {
  url: PropTypes.string.isRequired,
};
export default Home;
