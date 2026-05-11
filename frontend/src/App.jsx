import { useState } from "react";
import LoginSignup from "./pages/LoginSignup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState("login");

  return (
    <>
      {page === "login" && <LoginSignup setPage={setPage} />}
      {page === "onboarding" && <Onboarding setPage={setPage} />}
      {page === "dashboard" && <Dashboard />}
    </>
  );
}

export default App;