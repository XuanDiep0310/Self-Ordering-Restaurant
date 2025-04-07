import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AllRoute from "./components/AllRoute";

function App() {
  return (
    <Router>
      <AllRoute />
    </Router>
  );
}

export default App;