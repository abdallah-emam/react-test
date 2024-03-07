import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import Message from "./masseges";

function App() {
  const [list, setList] = useState([]);
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

  return (
    <>
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
