import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { BrowserRouter as Router } from "react-router-dom"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  // Had to disable react strictmode to use google-map-react
  <Router>
    <App />
  </Router>

  // </React.StrictMode>
)
