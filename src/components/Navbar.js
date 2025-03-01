import { useState } from "react";
import "../styles/Navbar.css";
import { PROD_BASE_URL } from "../constants";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const [username, setUsername] = useState(localStorage.getItem("username") || "");
    const [showModal, setShowModal] = useState(false);
    const [inputUsername, setInputUsername] = useState("");

    const handleRegister = async () => {
        if (!inputUsername.trim()) return;

        try {
            const response = await fetch(`${PROD_BASE_URL}/api/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: inputUsername }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("username", data.user.username);
                setUsername(data.user.username);
                setIsLoggedIn(true);
                setShowModal(false);
                
                const guestScore = localStorage.getItem("guestScore");
                if (guestScore) {
                    try {
                        const response = await fetch(`${PROD_BASE_URL}/api/users/update-score`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ username: inputUsername, score: parseInt(guestScore) })
                        });
        
                        const data = await response.json();
                        console.log("Guest score updated:", data);
                        
                        localStorage.removeItem("guestScore"); // Remove score after updating
                    } catch (error) {
                        console.error("Error updating guest score:", error);
                    }
                }

            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error registering:", error);
        }
    };

    const handleChallenge = async () => {
        if (!username) {
            alert("Please register before challenging a friend!");
            return;
        }

        try {
            const response = await fetch(`${PROD_BASE_URL}/api/invite/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });

            const data = await response.json();
            if (response.ok) {
                const { inviteLink, inviterUsername, inviterScore } = data;

                // Create WhatsApp share message
                const whatsappMessage = `Hey! I scored ${inviterScore} in this game. Think you can beat me? Accept my challenge here: ${inviteLink}`;
                
                // Open WhatsApp share
                window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error generating invite:", error);
        }
    };

    return (
        <>
            <nav className="navbar">
                <h1 className="logo">🌍 The Globetrotter Challenge</h1>
                <div className="user-section">
                    {isLoggedIn ? (
                        <>
                            <span className="username">Welcome, {username}</span>
                            <button className="btn-secondary" onClick={handleChallenge}>
                                Challenge a Friend
                            </button>
                        </>
                    ) : (
                        <button className="btn-primary" onClick={() => setShowModal(true)}>
                            Login / Register
                        </button>
                    )}
                </div>
            </nav>

            {/* Username Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Enter Username</h2>
                        <input
                            type="text"
                            value={inputUsername}
                            onChange={(e) => setInputUsername(e.target.value)}
                            className="input-field"
                            placeholder="Enter username"
                        />
                        <div className="button-group">
                            <button className="btn-success" onClick={handleRegister}>Submit</button>
                            <button className="btn-danger" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
