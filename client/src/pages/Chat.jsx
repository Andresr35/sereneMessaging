import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CreateMessage from "../components/CreateMessage";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";

const Chat = ({ url }) => {
  const [messages, setMessages] = useState([]);
  const [openMessage, setOpenMessage] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userRes = await fetch(
        `${url}/api/users/${localStorage.getItem("userID")}/messages`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (userRes.status == 403) {
        navigate("/");
      }
      const userData = await userRes.json();
      if (userData.status == 200) {
        setMessages(userData.messages);
        setUser(userData.user);
      } else {
        setError(userData.message);
      }
    };
    fetchUser();
  }, []);

  const toggleName = (name) => {
    if (openMessage == name) {
      setOpenMessage("");
    } else setOpenMessage(name);
  };

  const grabUsers = () => {
    return messages.reduce((prev, curr) => {
      if (
        !Object.prototype.hasOwnProperty.call(prev, curr.reciever._id) &&
        curr.reciever.name != user.name
      )
        prev[curr.reciever._id] = {
          name: curr.reciever.name,
          bio: curr.reciever.bio,
          gender: curr.reciever.gender,
          age: curr.reciever.age,
        };
      return prev;
    }, {});
  };

  const sendMessage = async (e, recieverID) => {
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
          message: e.target.message.value,
          recieverID: recieverID,
        }),
      }
    );
    const messageData = await messageRes.json();
    if (messageData.status == 201) {
      setMessages([...messages, messageData.data]);
      e.target.reset();
    }
  };

  return (
    <div>
      <nav>
        <h1>Chat</h1>
        <Logout />
      </nav>

      <CreateMessage url={url} setMessages={setMessages} messages={messages} />
      <p>{error}</p>
      {Object.entries(grabUsers()).map(([id, { name, bio, gender, age }]) => (
        <div key={id} className="bubble">
          <h4 onClick={() => toggleName(name)}>{name}</h4>

          {name == openMessage && (
            <div>
              <p className="stats">
                {gender && <>Gender: {gender} </>} {age && <> Age: {age}</>}
              </p>
              {bio && <p>{bio}</p>}
              {messages
                .filter(
                  (message) =>
                    message.reciever.name == name ||
                    message.messenger.name == name
                )
                .map((message, index) => (
                  <p
                    key={index}
                    className={
                      message.messenger.name == user.name
                        ? "messenger"
                        : "reciever"
                    }
                  >
                    {message.message}
                  </p>
                ))}
              <form onSubmit={(e) => sendMessage(e, id)}>
                <input type="text" placeholder="Enter Message" name="message" />
                <button type="submit">Send</button>
              </form>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
Chat.propTypes = { url: PropTypes.string.isRequired };

export default Chat;
