import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function LandingPage() {
    const router = useNavigate();

    return (
        <div className="container">
            <h1>Limgrave</h1>
            <p>Connect with anyone, anywhere</p>
            <div className="card">
                <button className="btn" onClick={() => router("/auth")}>
                    Get Started
                </button>
            </div>
        </div>
    );
}
