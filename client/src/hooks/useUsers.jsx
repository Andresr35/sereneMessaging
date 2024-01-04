import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const useUsers = (url) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const usersRes = await fetch(`${url}/api/users`);
      const usersData = await usersRes.json();
      if (usersData.status == 200) setUsers(usersData.users);
      else console.log(usersData);
    };
    fetchUsers();
  }, []);
  return { users, setUsers };
};

useUsers.propTypes = {
  url: PropTypes.string.isRequired,
};

export default useUsers;
