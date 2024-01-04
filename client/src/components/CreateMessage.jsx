import PropTypes from "prop-types";
import { useState } from "react";
import useUsers from "../hooks/useUsers";

const CreateMessage = ({ url, setMessages, messages }) => {
  const [message, setMessage] = useState({
    message: "",
    recieverID: "",
  });
  const { users } = useUsers(url);
  const sendMessage = async (e) => {
    e.preventDefault();
    const messageRes = await fetch(
      `${url}/api/users/${localStorage.getItem("userID")}/message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...message,
        }),
      }
    );

    const messageData = await messageRes.json();
    if (messageData.status == 201) {
      setMessages([...messages, messageData.data]);
      setMessage({ message: "", recieverID: "" });
      e.target.reset();
    }
  };

  return (
    <div>
      Send New Message
      <form onSubmit={sendMessage}>
        <select
          name="recipient"
          defaultValue="select"
          onChange={(e) =>
            setMessage({ ...message, recieverID: e.target.value })
          }
        >
          <option value="select" disabled>
            Select User
          </option>
          {users.map((user, index) => (
            <option key={index} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Enter Message"
          value={message.message}
          onChange={(e) => setMessage({ ...message, message: e.target.value })}
        />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

CreateMessage.propTypes = {
  url: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  setMessages: PropTypes.func.isRequired,
};

export default CreateMessage;
