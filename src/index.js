import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
// const cors = require('cors')
// App.arguments(cors())

// ^^^ This didnt work so I took it off:( ^^^