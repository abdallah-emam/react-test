import axios from "axios";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import "./App.css";
import Message from "./masseges";

function App() {
  const [list, setList] = useState([]);
  const user = "65c4ac41ea6b0fef2180a476";
  const [notification, setNotification] = useState([]);
  console.log("🚀 ~ App ~ notification:", notification);
  const [count, setCount] = useState(0);

  console.log("🚀 ~ App ~ list:", list);
  useEffect(() => {
    axios
      .get(
        "https://api.support.matnsolutions.com/project-discussion/65c4a625ea6b0fef2180a464"
      )
      .then((response) => {
        // Handle the response data
        setList(response.data);

        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch post from backend
    axios
      .get(`http://localhost:3050/notification/employee/${user}`)
      .then((response) => {
        setNotification(response.data.allNotifications);
        setCount(response.data.unreadNotifications);
      });

    // Initialize Pusher
    const pusher = new Pusher("9877e7a982601ae0839b", {
      cluster: "eu",
      encrypted: true,
    });

    // Subscribe to specific channel for the post
    const channel = pusher.subscribe(`notify-${user}`);

    // Listen for 'new-comment' event
    channel.bind("new-notification", (data) => {
      console.log("🚀 ~ channel.bind ~ data:", data);
      // Update the UI with the new comment
      setNotification((prev) => [...prev, data]);
      setCount((prev) => prev + 1);
      // setNewComment((prev) => {
      //   return {
      //     ...prev,
      //     data?.message,
      //   };
      // });
    });

    // Clean up on unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [user]);

  return (
    <>
      <div>
        notification center {count}
        {notification.length > 0 &&
          notification.map((item) => (
            <div key={item._id}>
              <h2
                onClick={() => {
                  if (item.read) return;
                  axios
                    .patch(
                      `http://localhost:3050/notification/read/${item._id}`
                    )
                    .then((response) => {
                      setCount((prev) => prev - 1);
                      console.log(response.data);
                    });
                }}
              >
                {item.message}{" "}
              </h2>
              <p>{item.description}</p>
            </div>
          ))}
      </div>
      {/* all posts */}
      <div>
        {list.length > 0 &&
          list.map((item) => (
            <div key={item.id}>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <Message discussionId={item._id} />
            </div>
          ))}
      </div>
    </>
  );
}

export default App;
