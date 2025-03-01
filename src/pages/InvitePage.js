import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/InvitePage.css";
import { PROD_BASE_URL } from "../constants";

const InvitePage = () => {
    const { inviteCode } = useParams();
    const [inviter, setInviter] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInviteDetails = async () => {
            try {
                const response = await fetch(`${PROD_BASE_URL}/api/invite/${inviteCode}`);
                const data = await response.json();

                if (response.ok) {
                    setInviter(data);
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Error fetching invite details:", error);
            }
            setLoading(false);
        };

        fetchInviteDetails();
    }, [inviteCode]);

    return (
        <div className="invite-container">
            {loading ? (
                <p>Loading...</p>
            ) : inviter ? (
                <div className="invite-card">
                    <h2>{inviter.inviterUsername} has challenged you!</h2>
                    <p>Their Score: {inviter.inviterScore}</p>
                    <button className="start-game-btn" onClick={() => navigate("/")}>Start Game</button>
                </div>
            ) : (
                <p>Invalid invite link</p>
            )}
        </div>
    );
};

export default InvitePage;
