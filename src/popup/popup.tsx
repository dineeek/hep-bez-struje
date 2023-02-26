import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Popup = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  return (
    <>
      <div style={{ minWidth: "500px" }}>
        Današnji datum: {new Date().toUTCString()}
      </div>

      <button onClick={() => setCount(count + 1)}>count up</button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
