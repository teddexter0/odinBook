# 🚀 Odin-Book

A modern, full-stack social media application built with React and Node.js. Share your thoughts, discover new people, and connect with the community!

![Odin-Book Banner](https://via.placeholder.com/800x200/667eea/ffffff?text=🚀+Odin-Book)

## ✨ Features

### 🔐 Authentication
- **Secure Login/Register** - JWT-based authentication
- **Demo Account Ready** - Pre-configured test credentials
- **Session Management** - Automatic token handling

### 📰 Social Feed
- **Create Posts** - Share thoughts up to 500 characters
- **Interactive Feed** - Real-time post updates
- **Like System** - Heart posts you enjoy
- **Author Attribution** - See who posted what

### 👥 User Discovery
- **Browse Users** - Discover other community members
- **User Profiles** - View display names, usernames, and bios
- **Beautiful Cards** - Clean, modern user interface

### 👤 Profile Management
- **Personal Dashboard** - View your profile information
- **Join Date Tracking** - See when you became a member
- **Stats Overview** - Posts, followers, following (expandable)

### 🎨 Modern UI/UX
- **Gradient Design** - Beautiful purple-blue theme
- **Responsive Layout** - Works on desktop and mobile
- **Smooth Animations** - Hover effects and transitions
- **Loading States** - Professional user experience

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **CSS3** - Custom styling with gradients and animations
- **Fetch API** - HTTP client for API communication

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support
- **Helmet** - Security middleware
- **Morgan** - Request logging
- **Rate Limiting** - API protection

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sod/odinBook.git
   cd odinBook
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the backend server**
   ```bash
   cd ../backend
   npm start
   ```
   Server will run on `http://localhost:5000`

5. **Start the frontend development server**
   ```bash
   cd ../frontend
   npm start
   ```
   App will open at `http://localhost:3000`

### 🎯 Demo Access

The app comes with pre-configured demo data:

**Demo Account:**
- **Email:** `john@example.com`
- **Password:** `password123`

**Alternative Demo Account:**
- **Email:** `jane@example.com` 
- **Password:** `password123`

## 📁 Project Structure

```
odinBook/
├── backend/
│   ├── server.js          # Express server & API routes
│   ├── package.json       # Backend dependencies
│   └── package-lock.json
├── frontend/
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styling
│   │   └── index.js       # React entry point
│   └── package.json       # Frontend dependencies
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Users
- `GET /api/users/me` - Get current user profile
- `GET /api/users` - Get all users (except current)

### Posts
- `GET /api/posts` - Get all posts with author info
- `POST /api/posts` - Create a new post

### Interactions
- `POST /api/posts/:id/like` - Toggle like on a post

### System
- `GET /api/health` - Health check endpoint

## 🎨 UI Components

### 📱 Responsive Design
- **Mobile-First** - Optimized for all screen sizes
- **Flexible Grid** - Auto-adjusting user cards
- **Collapsible Navigation** - Mobile-friendly header

### 🎯 Key Screens
- **Login/Register** - Elegant authentication forms
- **Feed** - Social media timeline
- **Discover** - User browsing interface
- **Profile** - Personal dashboard

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt protection
- **CORS Configuration** - Cross-origin security
- **Rate Limiting** - API abuse prevention
- **Helmet Middleware** - Security headers
- **Input Validation** - Data sanitization

## 🌟 Future Enhancements

### Planned Features
- **Real Database** - PostgreSQL/MongoDB integration
- **File Uploads** - Profile pictures and post images
- **Follow System** - User connections
- **Real-time Updates** - WebSocket integration
- **Push Notifications** - Engagement alerts
- **Advanced Search** - User and post discovery
- **Comment System** - Post interactions
- **Direct Messaging** - Private conversations

### Technical Improvements
- **TypeScript** - Enhanced type safety
- **Testing Suite** - Jest + React Testing Library
- **Docker Support** - Containerized deployment
- **CI/CD Pipeline** - Automated deployment
- **Performance Optimization** - Code splitting, lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is part of [The Odin Project](https://www.theodinproject.com/) curriculum. Feel free to use it for learning purposes.

## 🙏 Acknowledgments

- **The Odin Project** - For the excellent curriculum
- **React Team** - For the amazing framework
- **Express.js** - For the robust backend framework
- **Community** - For inspiration and support

---

<p align="center">
  <strong>Built with ❤️ as part of The Odin Project journey</strong>
</p>

<p align="center">
  <a href="#top">⬆️ Back to Top</a>
</p>