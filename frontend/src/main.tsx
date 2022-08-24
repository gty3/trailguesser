import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  // Had to disable react strictmode to use google-map-react
    <App />
  // </React.StrictMode>
)
