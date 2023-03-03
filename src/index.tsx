import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./fonts/fonts.css";
import "./components/ui/common.css";
import "./components/ui/box.css";
import App from "./components/app/app";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);

reportWebVitals();
