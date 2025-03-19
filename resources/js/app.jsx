import React from "react";
import ReactDOM from "react-dom/client";
import BusinessBoard from "./Pages/BusinessBoard";
import "../css/app.css";

/**
 * Renders the BusinessBoard component inside the 'app' div in the DOM.
 * 
 * This is the entry point for the frontend application, where React is initialized.
 */
ReactDOM.createRoot(document.getElementById("app")).render(<BusinessBoard />);
