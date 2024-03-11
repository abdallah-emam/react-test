// React frontend

import axios from "axios";
import Pusher from "pusher-js";
import React, { useEffect, useState } from "react";

const Message = ({ discussionId }) => {
  // console.log("🚀 ~ Message ~ discussionId:", discussionId);
  const [newComment, setNewComment] = useState([]);
  const [value, setValue] = useState("");

  // console.log("🚀 ~ Message ~ newComment:", newComment);

  const handleSubmit = (e) => {
    e.preventDefault();
    // clear the input field
    setValue("");
    // console.log("🚀 ~ Message ~ value:", value);
    // // Save the comment to the database
    axios
      .post(`http://localhost:3050/project-discussion-messages`, {
        message: value,
        employeeId: "65c4abddea6b0fef2180a471",
        projectDiscussionId: discussionId,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // Fetch post from backend
    axios
      .get(`http://localhost:3050/project-discussion-messages/${discussionId}`)
      .then((response) => {
        setNewComment(response.data);
      });

    // Initialize Pusher
    const pusher = new Pusher("9877e7a982601ae0839b", {
      cluster: "eu",
      encrypted: true,
    });

    // Subscribe to specific channel for the post
    const channel = pusher.subscribe(`post-${discussionId}`);

    // Listen for 'new-comment' event
    channel.bind("new-message", (data) => {
      // console.log("🚀 ~ channel.bind ~ data:", data);
      // Update the UI with the new comment
      setNewComment((prev) => [...prev, data]);
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
  }, [discussionId]);

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        {newComment.length > 0 &&
          newComment.map((item) => (
            <div key={item.id}>
              <br />
              {/* input for new message */}
              <h2>{item.employeeName}</h2>
              <p>{item.message}</p>
            </div>
          ))}
        <input
          type="text"
          placeholder="Enter your message"
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Message;
