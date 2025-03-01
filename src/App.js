import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InvitePage from "./pages/InvitePage";
import Quiz from "./pages/Quiz";
import Navbar from "./components/Navbar";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("username")); 
    return (
        <Router>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Routes>
                <Route path="/" element={<Quiz />} />
                <Route path="/api/invite/:inviteCode" element={<InvitePage />} />
            </Routes>
        </Router>
    );
}

export default App;
