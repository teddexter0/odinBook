const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let users = [
  {
    id: 1,
    username: 'johndoe',
    email: 'john@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8xQ9mw5FLq', // password123
    displayName: 'John Doe',
    bio: 'Software developer and coffee enthusiast ☕',
    createdAt: new Date()
  },
  {
    id: 2,
    username: 'janesmith',
    email: 'jane@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8xQ9mw5FLq', // password123
    displayName: 'Jane Smith',
    bio: 'Designer who loves creating beautiful things ✨',
    createdAt: new Date()
  }
];

let posts = [
  { id: 1, userId: 1, content: 'Welcome to Odin-Book! 🚀 This is my first post.', createdAt: new Date() },
  { id: 2, userId: 2, content: 'Just finished an amazing design project! 🎨', createdAt: new Date() },
  { id: 3, userId: 1, content: 'Coffee + Code = Perfect Morning ☕👨‍💻', createdAt: new Date() }
];

let likes = [];

const JWT_SECRET = 'your-secret-key';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Odin-Book API is running!',
    users: users.length + ' users',
    posts: posts.length + ' posts'
  });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email.toLowerCase());
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // For demo, accept "password123" for all users
    if (password !== 'password123') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;

    if (users.find(u => u.email === email || u.username === username)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = {
      id: users.length + 1,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: 'hashed', // In real app, hash the password
      displayName,
      bio: '',
      createdAt: new Date()
    };

    users.push(user);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// User routes
app.get('/api/users/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

app.get('/api/users', authenticateToken, (req, res) => {
  const otherUsers = users
    .filter(u => u.id !== req.user.userId)
    .map(({ password, ...user }) => user);
  
  res.json({ users: otherUsers });
});

// Post routes
app.get('/api/posts', authenticateToken, (req, res) => {
  const postsWithDetails = posts.map(post => {
    const author = users.find(u => u.id === post.userId);
    const isLiked = likes.some(l => l.postId === post.id && l.userId === req.user.userId);
    const likesCount = likes.filter(l => l.postId === post.id).length;
    
    return {
      ...post,
      author: author ? {
        id: author.id,
        username: author.username,
        displayName: author.displayName
      } : null,
      isLiked,
      likesCount
    };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ posts: postsWithDetails });
});

app.post('/api/posts', authenticateToken, (req, res) => {
  const { content } = req.body;
  
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: 'Post content is required' });
  }

  const post = {
    id: posts.length + 1,
    userId: req.user.userId,
    content: content.trim(),
    createdAt: new Date()
  };

  posts.push(post);
  res.status(201).json({ message: 'Post created successfully', post });
});

// Like routes
app.post('/api/posts/:postId/like', authenticateToken, (req, res) => {
  const postId = parseInt(req.params.postId);
  const userId = req.user.userId;

  const existingLike = likes.find(l => l.postId === postId && l.userId === userId);
  
  if (existingLike) {
    likes = likes.filter(l => !(l.postId === postId && l.userId === userId));
    res.json({ message: 'Post unliked', isLiked: false });
  } else {
    likes.push({ id: likes.length + 1, postId, userId, createdAt: new Date() });
    res.json({ message: 'Post liked', isLiked: true });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log('🎯 Demo login: john@example.com / password123');
});
