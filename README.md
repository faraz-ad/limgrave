# 🎥 Video Conferencing Application

A full-stack video conferencing web application with real-time audio/video communication, built with React, Node.js, Socket.IO, and WebRTC.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## ✨ Features

-   🎬 **Real-time Video Conferencing** - High-quality peer-to-peer video calls
-   🎤 **Audio Communication** - Crystal clear audio with noise suppression
-   💬 **In-Meeting Chat** - Text messaging during video calls
-   🖥️ **Screen Sharing** - Share your screen with participants
-   🌓 **Dark/Light Mode** - Toggle between themes for comfort
-   📱 **Mobile Responsive** - Works seamlessly on mobile devices
-   🔐 **User Authentication** - Secure login and registration
-   📊 **Meeting History** - Track your past meetings
-   🌍 **Cross-Network Support** - Dedicated TURN server for NAT traversal
-   👥 **Multi-Participant** - Support for multiple users in a single meeting

## 🏗️ Tech Stack

### Frontend

-   **React** 18.2.0 - UI framework
-   **Material-UI** - Component library
-   **Socket.IO Client** - Real-time bidirectional communication
-   **WebRTC** - Peer-to-peer video/audio streaming
-   **React Router** - Client-side routing
-   **Axios** - HTTP client

### Backend

-   **Node.js** - Runtime environment
-   **Express** - Web framework
-   **Socket.IO** - WebSocket server
-   **MongoDB** - Database
-   **Mongoose** - ODM for MongoDB
-   **bcrypt** - Password hashing
-   **CORS** - Cross-origin resource sharing

### Infrastructure

-   **CoTURN** - TURN server for WebRTC NAT traversal
-   **DigitalOcean** - VPS hosting for TURN server
-   **Vercel** - Frontend deployment
-   **Render** - Backend deployment

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js** (v14 or higher)
-   **npm** or **yarn**
-   **MongoDB** (local or cloud instance)
-   **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/dhanyabad11/Limgrave-web.git
cd Zoom-main
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following environment variables to `.env`:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

Start the backend server:

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following environment variables to `.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

Start the frontend development server:

```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 🔧 TURN Server Configuration

For cross-network video calls (e.g., WiFi to mobile data), a TURN server is required:

### Option 1: Use Our Configured TURN Server

The application is pre-configured with a dedicated TURN server at `139.59.67.205:3478`.

### Option 2: Set Up Your Own TURN Server

**On Ubuntu/Debian VPS:**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install CoTURN
sudo apt install coturn -y

# Enable CoTURN
sudo systemctl enable coturn

# Edit configuration
sudo nano /etc/turnserver.conf
```

**Basic CoTURN Configuration:**

```conf
# TURN server name and realm
realm=turnserver
server-name=turnserver

# Listening IP and ports
listening-ip=0.0.0.0
listening-port=3478
tls-listening-port=5349

# External IP (your VPS public IP)
external-ip=YOUR_VPS_PUBLIC_IP

# Authentication
lt-cred-mech
user=username:password

# Relay ports
min-port=49152
max-port=65535

# Security
denied-peer-ip=10.0.0.0-10.255.255.255
denied-peer-ip=192.168.0.0-192.168.255.255
denied-peer-ip=172.16.0.0-172.31.255.255

# Performance
no-tls
no-dtls
```

**Start CoTURN:**

```bash
sudo systemctl start coturn
sudo systemctl status coturn
```

**Configure Firewall:**

```bash
sudo ufw allow 22/tcp
sudo ufw allow 3478/tcp
sudo ufw allow 3478/udp
sudo ufw allow 5349/tcp
sudo ufw allow 5349/udp
sudo ufw allow 49152:65535/udp
sudo ufw enable
```

**Update Frontend Configuration:**

Edit `frontend/src/pages/VideoMeet.jsx`:

```javascript
const peerConfigConnections = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        {
            urls: ["turn:YOUR_VPS_IP:3478", "turn:YOUR_VPS_IP:3478?transport=tcp"],
            username: "your_username",
            credential: "your_password",
        },
    ],
};
```

## 📁 Project Structure

```
Zoom-main/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── socketManager.js    # Socket.IO event handlers
│   │   │   └── user.controller.js  # User authentication logic
│   │   ├── models/
│   │   │   ├── meeting.model.js    # Meeting schema
│   │   │   └── user.model.js       # User schema
│   │   ├── routes/
│   │   │   └── users.routes.js     # API routes
│   │   └── app.js                  # Express app setup
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx     # Authentication context
│   │   ├── pages/
│   │   │   ├── authentication.jsx  # Login/Register page
│   │   │   ├── home.jsx            # Home page
│   │   │   ├── landing.jsx         # Landing page
│   │   │   ├── history.jsx         # Meeting history
│   │   │   └── VideoMeet.jsx       # Video conference room
│   │   ├── styles/
│   │   │   └── videoComponent.module.css
│   │   ├── utils/
│   │   │   └── withAuth.jsx        # Auth HOC
│   │   ├── App.js
│   │   ├── environment.js          # Backend URL config
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🎮 Usage

### Creating a Meeting

1. **Register/Login** - Create an account or log in
2. **Start Meeting** - Click "New Meeting" to create a room
3. **Share Meeting ID** - Copy and share the meeting ID with participants
4. **Join Meeting** - Participants enter the meeting ID to join

### During a Meeting

-   🎥 **Toggle Video** - Turn camera on/off
-   🎤 **Toggle Audio** - Mute/unmute microphone
-   🖥️ **Screen Share** - Share your screen
-   💬 **Open Chat** - Send text messages
-   🌓 **Dark Mode** - Switch themes
-   📋 **Copy Meeting ID** - Share the meeting link
-   ☎️ **End Call** - Leave the meeting

## 🔑 API Endpoints

### User Authentication

```
POST /api/v1/users/register
POST /api/v1/users/login
GET  /api/v1/users/profile
POST /api/v1/users/add-to-history
GET  /api/v1/users/get-history
```

### Socket Events

```
join-call          - Join a meeting room
signal             - WebRTC signaling
user-joined        - New user joined notification
user-left          - User left notification
chat-message       - Send/receive chat messages
```

## 🐛 Troubleshooting

### Video/Audio Not Working

1. **Check browser permissions** - Allow camera and microphone access
2. **Check TURN server** - Ensure CoTURN is running: `systemctl status coturn`
3. **Check firewall** - Verify ports are open
4. **Check console logs** - Look for WebRTC errors in browser console

### Connection Issues

-   **STUN/TURN servers** - Verify TURN server is accessible
-   **Network firewall** - Corporate firewalls may block WebRTC
-   **Browser compatibility** - Use Chrome, Firefox, or Safari (latest versions)

### Console Debugging

Look for these success indicators:

-   ✅ "ICE connection established"
-   🔄 "Using TURN relay server"
-   📹 "Track received from: [socketId]"

## 🚀 Deployment

### Backend Deployment (Render)

1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### Frontend Deployment (Vercel)

1. Create account on [Vercel](https://vercel.com)
2. Import GitHub repository
3. Set build command: `npm run build`
4. Set environment variables
5. Deploy

## 📝 Environment Variables

### Backend (.env)

```env
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
NODE_ENV=production
```

### Frontend (.env)

```env
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Dhanyabad**

-   GitHub: [@dhanyabad11](https://github.com/dhanyabad11)

## 🙏 Acknowledgments

-   WebRTC for peer-to-peer communication
-   Socket.IO for real-time messaging
-   Material-UI for beautiful components
-   CoTURN for TURN server implementation
-   DigitalOcean for reliable VPS hosting

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

Made with ❤️ by Dhanyabad
