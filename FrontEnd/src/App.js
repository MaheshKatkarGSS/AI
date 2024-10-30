import logo from "./logo.svg";
import "./App.css";
import MainLayout from "./components/layout/MainLayout";
import { Route, Routes } from "react-router";
import { Typography } from "@mui/material";
import CreateInterview from "./components/views/CreateInterview";

function App() {
  return (
    <div className="App" style={{ padding: "30px" }}>
      <div>
        <Typography variant="h5">Interview.AI</Typography>
      </div>
      <div style={{ padding: "30px" }}>
        <Routes>
          <Route path="/" element={<CreateInterview />} />
          <Route path="/startInterview" element={<MainLayout />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;
