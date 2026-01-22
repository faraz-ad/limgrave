import { Router } from "express";

const router = Router();

// Endpoint to get ICE servers configuration
router.get("/ice-servers", async (req, res) => {
    try {
        // Return STUN and TURN servers
        const iceServers = [
            // STUN servers
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            { urls: "stun:stun2.l.google.com:19302" },
            // Free TURN servers
            {
                urls: [
                    "turn:openrelay.metered.ca:80",
                    "turn:openrelay.metered.ca:443",
                    "turn:openrelay.metered.ca:443?transport=tcp",
                ],
                username: "openrelayproject",
                credential: "openrelayproject",
            },
        ];

        res.json({
            success: true,
            iceServers: iceServers,
        });
    } catch (error) {
        console.error("Error getting ICE servers:", error);
        res.status(500).json({
            success: false,
            error: "Failed to get ICE servers",
        });
    }
});

export default router;
