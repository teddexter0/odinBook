import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await fetch('/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        fetchPosts(token);
        fetchUsers(token);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      localStorage.removeItem('token');
    }
    setLoading(false);
  };

  const fetchPosts = async (token = localStorage.getItem('token')) => {
    try {
      const response = await fetch('/api/posts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchUsers = async (token = localStorage.getItem('token')) => {
    try {
      const response = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLogin = async (formData) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        fetchPosts(data.token);
        fetchUsers(data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Connection error' };
    }
  };

  const handleRegister = async (formData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        fetchPosts(data.token);
        fetchUsers(data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Connection error' };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setPosts([]);
    setUsers([]);
  };

  const createPost = async (content) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content })
      });
      
      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const toggleLike = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner">🚀</div>
        <p>Loading Odin-Book...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>🚀 Odin-Book</h1>
        <nav className="nav-tabs">
          <button 
            className={activeTab === 'feed' ? 'active' : ''} 
            onClick={() => setActiveTab('feed')}
          >
            📰 Feed
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={() => setActiveTab('users')}
          >
            👥 Discover
          </button>
          <button 
            className={activeTab === 'profile' ? 'active' : ''} 
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
        </nav>
        <div className="user-info">
          <span>👋 {user.displayName}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'feed' && (
          <FeedTab posts={posts} onCreatePost={createPost} onToggleLike={toggleLike} />
        )}
        {activeTab === 'users' && (
          <UsersTab users={users} />
        )}
        {activeTab === 'profile' && (
          <ProfileTab user={user} />
        )}
      </main>
    </div>
  );
}

function LoginScreen({ onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: 'john@example.com',  // Pre-filled for easy testing
    password: 'password123',
    username: '',
    displayName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = isLogin 
      ? await onLogin({ email: formData.email, password: formData.password })
      : await onRegister(formData);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-screen">
      <div className="auth-form">
        <h1>🚀 Odin-Book</h1>
        <h2>{isLogin ? 'Welcome Back!' : 'Join the Community'}</h2>
        
        <div className="demo-info">
          <p><strong>🎯 Ready to Test!</strong></p>
          <p>📧 john@example.com</p>
          <p>🔐 password123</p>
          <p><em>Just click "Sign In" →</em></p>
        </div>
        
        {error && <div className="error">❌ {error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Display Name"
                value={formData.displayName}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                required
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? '⏳ Please wait...' : (isLogin ? '🚀 Sign In' : '✨ Create Account')}
          </button>
        </form>
        
        <p className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            className="link-button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              if (isLogin) {
                setFormData({ email: '', password: '', username: '', displayName: '' });
              } else {
                setFormData({ email: 'john@example.com', password: 'password123', username: '', displayName: '' });
              }
            }}
          >
            {isLogin ? '✨ Create Account' : '🚀 Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}

function FeedTab({ posts, onCreatePost, onToggleLike }) {
  const [newPost, setNewPost] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      onCreatePost(newPost);
      setNewPost('');
    }
  };

  return (
    <div className="feed-tab">
      <div className="create-post">
        <h3>💭 What's on your mind?</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share something interesting..."
            rows="3"
            maxLength="500"
          />
          <div className="post-form-bottom">
            <span className="char-count">{newPost.length}/500</span>
            <button type="submit" disabled={!newPost.trim()}>
              📝 Post
            </button>
          </div>
        </form>
      </div>

      <div className="posts">
        <h3>🌟 Recent Posts</h3>
        {posts.length === 0 ? (
          <div className="empty-state">
            <h4>📭 No posts yet</h4>
            <p>Be the first to share something!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post">
              <div className="post-header">
                <div className="author-info">
                  <div className="author-avatar">
                    {post.author?.displayName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <strong>{post.author?.displayName || 'Unknown User'}</strong>
                    <span className="username">@{post.author?.username}</span>
                  </div>
                </div>
                <span className="post-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="post-content">
                {post.content}
              </div>
              <div className="post-actions">
                <button 
                  className={`like-btn ${post.isLiked ? 'liked' : ''}`}
                  onClick={() => onToggleLike(post.id)}
                >
                  {post.isLiked ? '❤️' : '🤍'} {post.likesCount || 0} likes
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function UsersTab({ users }) {
  return (
    <div className="users-tab">
      <h3>👥 Discover People</h3>
      <div className="users-grid">
        {users.length === 0 ? (
          <div className="empty-state">
            <p>No other users found</p>
          </div>
        ) : (
          users.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-avatar">
                {user.displayName.charAt(0)}
              </div>
              <h4>{user.displayName}</h4>
              <p className="username">@{user.username}</p>
              {user.bio && <p className="user-bio">{user.bio}</p>}
              <button className="follow-btn">👋 Say Hi</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ProfileTab({ user }) {
  return (
    <div className="profile-tab">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.displayName.charAt(0)}
        </div>
        <div className="profile-info">
          <h2>{user.displayName}</h2>
          <p className="username">@{user.username}</p>
          <p className="email">📧 {user.email}</p>
          {user.bio && <p className="bio">💭 {user.bio}</p>}
          <p className="join-date">
            📅 Joined {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="profile-stats">
        <div className="stat">
          <strong>Posts</strong>
          <span>Coming soon</span>
        </div>
        <div className="stat">
          <strong>Followers</strong>
          <span>Coming soon</span>
        </div>
        <div className="stat">
          <strong>Following</strong>
          <span>Coming soon</span>
        </div>
      </div>
    </div>
  );
}

export default App; 