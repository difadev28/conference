# POC Conference Stream

A proof-of-concept video conference streaming application built with React, TypeScript, and Jitsi Meet. This application allows users to create and join video conference rooms with moderator controls and a clean, intuitive interface.

## 🚀 Features

- **Video Conferencing**: Full-featured video calls using Jitsi Meet
- **Room Management**: Create, join, and manage conference rooms
- **User Authentication**: Simple login system with user management
- **Moderator Controls**: Special privileges for room creators
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live participant count and room status
- **Local Storage**: Persistent room data storage

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Video Conferencing**: Jitsi Meet External API
- **Routing**: React Router v7
- **Authentication**: React Context API
- **Icons**: Lucide React
- **Data Persistence**: Local Storage

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Modern web browser with WebRTC support

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/poc-conference-stream.git
cd poc-conference-stream
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🏗️ Project Structure

```
poc-conference-stream/
├── src/
│   ├── components/           # React components
│   │   ├── ConferenceRoom.tsx   # Main video conference component
│   │   ├── Dashboard.tsx        # User dashboard with room management
│   │   ├── LoginPage.tsx        # Login/authentication page
│   │   └── HomePage.tsx         # Landing page
│   ├── context/            # React Context providers
│   │   └── AuthContext.tsx      # Authentication context
│   ├── data/              # Mock data and constants
│   │   └── mockData.ts         # Sample users and rooms
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx            # Main App component with routing
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.ts         # Vite build configuration
└── README.md              # This file
```

## 🔧 Configuration

### Jitsi Meet Configuration

The application uses the public Jitsi Meet server by default. You can customize the Jitsi configuration in the `ConferenceRoom.tsx` component:

```typescript
const domain = "meet.jit.si"; // Change to your Jitsi server
```

### Environment Variables

Create a `.env` file in the root directory for environment-specific configurations:

```env
VITE_JITSI_DOMAIN=meet.jit.si
VITE_APP_NAME=VideoMeet
```

## 📱 Usage

1. **Login**: Start by logging in with any credentials (demo mode)
2. **Dashboard**: View your rooms and create new conference rooms
3. **Create Room**: Click "Create New Room" to start a new meeting
4. **Join Room**: Enter as a moderator (if you created the room) or participant
5. **Video Conference**: Use the video conference interface with controls for:
   - Toggle audio/video
   - Screen sharing
   - Chat functionality
   - Participant management

## 🎯 Key Components

### ConferenceRoom Component

The core video conferencing component that:
- Initializes Jitsi Meet with custom configurations
- Manages audio/video state
- Handles participant events
- Provides custom UI controls

### Dashboard Component

User management interface featuring:
- Room creation and management
- Participant tracking
- Room status controls
- User authentication state

### Authentication

Simple authentication system using React Context:
- Demo mode with mock user data
- Session persistence in local storage
- User profile management

## 🔒 Security Considerations

- This is a POC application and not production-ready
- Authentication is for demonstration purposes only
- Consider implementing proper backend authentication for production
- Use secure Jitsi deployment with authentication for sensitive meetings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Notes

- The application uses the Jitsi Meet External API for video conferencing
- Custom UI overrides hide the default Jitsi interface elements
- Room data is stored locally for persistence across sessions
- The application is fully responsive and works on mobile devices

## 🚀 Future Enhancements

- [ ] Backend integration with real database
- [ ] End-to-end encryption support
- [ ] Recording functionality
- [ ] Calendar integration
- [ ] Advanced moderator controls
- [ ] Custom branding options
- [ ] WebSocket for real-time updates
- [ ] Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Jitsi Meet](https://jitsi.org/) for the excellent video conferencing platform
- [React](https://reactjs.org/) for the UI framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the fast build tool
- [Lucide](https://lucide.dev/) for the beautiful icons

## 📞 Support

For support or questions, please open an issue in the GitHub repository.

---

**Note**: This is a proof-of-concept application. For production use, ensure proper security measures, backend integration, and compliance with privacy regulations.