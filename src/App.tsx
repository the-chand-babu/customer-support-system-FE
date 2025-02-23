import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { Router } from "./Router";
import { use } from "react";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </div>
  );
}

export default App;
