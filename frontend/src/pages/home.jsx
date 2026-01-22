import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import withAuth from "../utils/withAuth";
import "../App.css";

function HomeComponent() {
    const [meetingCode, setMeetingCode] = useState("");
    const navigate = useNavigate();
    const { addToUserHistory } = useContext(AuthContext);

    const startMeeting = () => {
        const roomId = Math.random().toString(36).substring(2, 15);
        navigate(`/${roomId}`);
    };

    const joinMeeting = async () => {
        if (meetingCode.trim()) {
            await addToUserHistory(meetingCode);
            navigate(`/${meetingCode}`);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("name");
        navigate("/auth");
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Limgrave</h1>
                <div className="user-info">
                    <span>
                        Welcome, {localStorage.getItem("name") || localStorage.getItem("username")}
                    </span>
                    <button className="btn btn-danger" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>

            <div className="meeting-section">
                <div className="card">
                    <div className="card-icon">🎥</div>
                    <h3>Start a new meeting</h3>
                    <p>Start an instant meeting and invite others to join</p>
                    <button className="btn btn-primary" onClick={startMeeting}>
                        New Meeting
                    </button>
                </div>

                <div className="card">
                    <div className="card-icon">📞</div>
                    <h3>Join existing meeting</h3>
                    <p>Enter a meeting code to join an existing meeting</p>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Enter meeting code"
                            value={meetingCode}
                            onChange={(e) => setMeetingCode(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === "Enter" && meetingCode.trim() && joinMeeting()
                            }
                        />
                        <button
                            className="btn btn-secondary"
                            onClick={joinMeeting}
                            disabled={!meetingCode.trim()}
                        >
                            Join Meeting
                        </button>
                    </div>
                </div>
            </div>

            <div className="features-section">
                <h3>Features</h3>
                <div className="features-grid">
                    <div className="feature-item">
                        <span className="feature-icon">🔒</span>
                        <span>Secure meetings</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">💬</span>
                        <span>Real-time chat</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">📱</span>
                        <span>Mobile friendly</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🎮</span>
                        <span>Screen sharing</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withAuth(HomeComponent);
