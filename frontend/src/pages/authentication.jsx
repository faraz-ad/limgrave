import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "../App.css";

export default function Authentication() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const { handleRegister, handleLogin } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await handleLogin(username, password);
            } else {
                await handleRegister(name, username, password);
                setIsLogin(true);
                setName("");
                setUsername("");
                setPassword("");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error occurred");
        }
    };

    return (
        <div className="container">
            <h1>Welcome to Limgrave</h1>
            <p>{isLogin ? "Sign in to your account" : "Create a new account"}</p>

            <div className="form">
                <div
                    style={{
                        display: "flex",
                        marginBottom: "1.5rem",
                        background: "#f8f9fa",
                        borderRadius: "12px",
                        padding: "4px",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        style={{
                            flex: 1,
                            padding: "10px",
                            border: "none",
                            borderRadius: "8px",
                            background: isLogin ? "#667eea" : "transparent",
                            color: isLogin ? "white" : "#6c757d",
                            cursor: "pointer",
                            fontWeight: "500",
                        }}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        style={{
                            flex: 1,
                            padding: "10px",
                            border: "none",
                            borderRadius: "8px",
                            background: !isLogin ? "#667eea" : "transparent",
                            color: !isLogin ? "white" : "#6c757d",
                            cursor: "pointer",
                            fontWeight: "500",
                        }}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    )}
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && (
                        <p style={{ color: "#ff6b6b", fontSize: "14px", margin: "10px 0" }}>
                            {error}
                        </p>
                    )}
                    <button type="submit" className="btn" style={{ width: "100%" }}>
                        {isLogin ? "Login" : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
}
