import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};
let usernames = {}; // Store usernames for each socket

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("✅ New socket connected:", socket.id);

        socket.on("join-call", (path, username) => {
            console.log("📞 User joining call:");
            console.log("   - Socket ID:", socket.id);
            console.log("   - Username:", username);
            console.log("   - Path:", path);

            if (connections[path] === undefined) {
                connections[path] = [];
            }

            timeOnline[socket.id] = new Date();
            usernames[socket.id] = username || "Participant";

            console.log("   - Stored username:", usernames[socket.id]);
            console.log("   - Current users in room:", connections[path]);

            // Notify only EXISTING users about the new user joining
            connections[path].forEach((existingUserId) => {
                console.log(
                    "   - Notifying existing user:",
                    existingUserId,
                    "about new user:",
                    socket.id
                );
                io.to(existingUserId).emit(
                    "user-joined",
                    socket.id, // The new user's ID
                    connections[path].concat(socket.id), // Include the new user in the list
                    usernames
                );
            });

            // NOW add the new user to the connections
            connections[path].push(socket.id);

            console.log("   - Added new user. Updated room:", connections[path]);

            // Tell the NEW user about all existing users (and themselves)
            io.to(socket.id).emit(
                "user-joined",
                socket.id, // Their own ID (they'll skip it on the frontend)
                connections[path], // Now includes everyone including the new user
                usernames
            );

            // Send chat history to the new user
            if (messages[path] !== undefined) {
                for (let a = 0; a < messages[path].length; ++a) {
                    io.to(socket.id).emit(
                        "chat-message",
                        messages[path][a]["data"],
                        messages[path][a]["sender"],
                        messages[path][a]["socket-id-sender"]
                    );
                }
            }
        });

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        });

        socket.on("chat-message", (data, sender) => {
            const [matchingRoom, found] = Object.entries(connections).reduce(
                ([room, isFound], [roomKey, roomValue]) => {
                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }

                    return [room, isFound];
                },
                ["", false]
            );

            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = [];
                }

                messages[matchingRoom].push({
                    sender: sender,
                    data: data,
                    "socket-id-sender": socket.id,
                });
                console.log("message", matchingRoom, ":", sender, data);

                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message", data, sender, socket.id);
                });
            }
        });

        socket.on("disconnect", () => {
            var diffTime = Math.abs(timeOnline[socket.id] - new Date());

            var key;

            for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
                for (let a = 0; a < v.length; ++a) {
                    if (v[a] === socket.id) {
                        key = k;

                        for (let a = 0; a < connections[key].length; ++a) {
                            io.to(connections[key][a]).emit("user-left", socket.id);
                        }

                        var index = connections[key].indexOf(socket.id);

                        connections[key].splice(index, 1);

                        // Clean up username
                        delete usernames[socket.id];

                        if (connections[key].length === 0) {
                            delete connections[key];
                        }
                    }
                }
            }
        });
    });

    return io;
};
