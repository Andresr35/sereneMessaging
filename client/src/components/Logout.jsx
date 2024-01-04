import { useNavigate } from "react-router-dom";

const Logout = () => {
  const nav = useNavigate();

  const logOut = (e) => {
    e.preventDefault();
    sessionStorage.removeItem("token");
    localStorage.removeItem("userID");
    nav("/");
  };
  return <button onClick={logOut}>Log Out</button>;
};

export default Logout;
