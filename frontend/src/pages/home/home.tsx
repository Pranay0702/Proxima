import './home.css';
import profile1 from '../../imgs/profile1.jpg';
import axios from "axios";
import type { User1, Notification, Post } from "../../shared/interfaces/register.interface";
import { useEffect, useState } from "react";
import {
  Compass,
  Search,
  House,
  Bell,
  User,
  Plus,
  Users,
  BookOpen,
  X,
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  Share,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const [users, setUsers] = useState<User1[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentProfile, setCurrentProfile] = useState<User1 | null>(null);

  const [currentUser, setCurrentUser] = useState<User1  | null>(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const navigate = useNavigate();
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  useEffect(()=>{
    const storedUser = localStorage.getItem('currentUser');
    const parsedUser = storedUser? JSON.parse(storedUser):null;
    if(parsedUser){
      setCurrentUser(parsedUser);
    }
  },[]);

    const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('http://localhost:3000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentProfile(res.data.user);
    } catch (e) {
      console.error("Error fetching current user:", e);
    }
  };

  const fetchUsers = async (search: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/users/list', {
        headers: {Authorization: `Bearer ${token}`},
        params: {search}
      });

      const allUsers: User1[] = res.data.users;
      const currentUser  = localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser")as string):null;

      const others = currentUser
        ?allUsers.filter((u) => String(u._id)!==String(currentUser._id))
        :allUsers;

      const shuffled = [...others].sort(()=>0.5-Math.random());
      const suggested = shuffled.slice(0,3);

      setUsers(suggested);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchPosts = async () => {
    try{
      const token = localStorage.getItem('token');
      if(!token)return;

      const res = await axios.get('http://localhost:3000/api/posts',{
        headers:{Authorization:`Bearer ${token}`,},
      });
      setPosts(res.data.posts);
    }catch (error){
        console.error("error fetching posts:", error);
    }
  }

  const onNavigateToNetwork = () =>{
    navigate('/network');
  };

  const onNavigateToProfile = () =>{
    navigate('/profile');
  };

  const handleCreatePost = async ()=> {
    if (!newPostContent.trim())return;
    try{
        const token = localStorage.getItem('token');
        const res = await axios.post('http://localhost:3000/api/posts',
          {content: newPostContent},
          {headers: {Authorization: `Bearer ${token}`}}
        );

        //UI updates
        setPosts(prev => [res.data.post, ...prev]);
        setNewPostContent('');
    }catch (error){
        console.error("Error creating post:", error);
    }
  };

  const handleLike = async (postId: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await axios.post(
      `http://localhost:3000/api/posts/${postId}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, likes: res.data.likes, likedByUser: !post.likedByUser } : post
      )
    );
  } catch (err) {
    console.error('Error liking post:', err);
    }
  };

  const handleComment = async (postId: string) => {
    const commentText = prompt('Enter your comment:');
    if (!commentText) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.post(
        `http://localhost:3000/api/posts/${postId}/comment`,
        { message: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, comments: res.data.comments } : post
        )
      );
    } catch (err) {
      console.error('Error commenting on post:', err);
    }
  };



  useEffect(() => {
    if (currentUser){
      fetchCurrentUser();
      fetchUsers(searchTerm);
      fetchPosts();
    }
  },[searchTerm, currentUser]);
  

  const onLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const onMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
  };

  {/*st onMarkNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  };*/}

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_post': return '📝';
      case 'new_professional': return '👤';
      case 'connection': return '🤝';
      case 'like': return '❤️';
      case 'comment': return '💬';
      default: return '🔔';
    }
  };

  return (
    <div className="homepage">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <Compass className="logo-icon" />
              <span className="logo-text">Proxima</span>
            </div>
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search professional, companies, jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <nav className="header-nav">
            <span> Welcome, {currentUser?.username}</span>
            <button className="nav-item active">
              <House className="nav-icon" />
              <span>Home</span>
            </button>
            <button className="nav-item" onClick={onNavigateToNetwork}>
              <Users className='nav-icon'/>
              <span>Network</span>
            </button>
            <button className="nav-item" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell className="nav-icon" />
              <span>Notifications</span>
              {unreadNotificationsCount > 0 && (
                <span className='notification-badge'>{unreadNotificationsCount}</span>
              )}
            </button>
            <button className="nav-item" onClick={onNavigateToProfile}>
              <User className="nav-icon" />
              <span>Profile</span>
            </button>
            <button className="nav-item" onClick={onLogout}>
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          {currentProfile? (
              <div className="profile-card" key={currentProfile._id}>
                <div className="profile-header">
                  <img
                    src={currentProfile.profileImage || profile1}
                    alt={currentProfile.username}
                    className="profile-avatar"
                  />
                  <h3 className="profile-name">{currentProfile.username}</h3>
                  <p className="profile-title">{currentProfile.jobTitle || "No title"}</p>
                </div>
                <div className="profile-stats">
                  <div className="stat">
                    <span className="stat-label">Profile views</span>
                    <span className="stat-value">{currentProfile.profileViews ?? 0}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Connections</span>
                    <span className="stat-value">{currentProfile.connections?.length ?? 0}</span>
                  </div>
                </div>
              </div>
          ) : (
            <p className="no-users">No Profile found</p>
          )}

          <div className="quick-actions">
            <h4 className="section-title">Quick Action</h4>
            <button className="action-item">
              <Plus className="action-icon" />Create Post
            </button>
            <Link to="/network" className="action-item">
              <Users className='action-icon' /> Find Professionals
            </Link>
            <button className="action-item">
              <BookOpen className="action-icon" />Learning More
            </button>
          </div>
        </aside>

        <main className="feed">
            <div className="create-post">
                <img
                    src={profile1}
                    alt="Your avatar"
                    className="create-post-avatar"
                />
                <input
                    type="text"
                    placeholder="Share your thoughts with the community..."
                    className="create-post-input"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                />
                <button className="create-post-btn" onClick = {handleCreatePost}>Post</button>
            </div>

            <div className='posts'>
                {posts.map(post => (
                    <article key = {post.id} className='post'>
                        <div className = "post-header">
                            <img src={post.author.avatar||profile1} alt={post.author.name} className='post-avatar'/>
                            <div className='post-author-info'>
                                <h4 className='post-author-name'>{post.author.name}</h4>
                                <p className='post-author-title'>{post.author.title} at {post.author.company}</p>
                                <span className='post-time'>{post.timeAgo} ago</span>
                            </div>
                            <button className='post-menu'>
                                <MoreHorizontal/>
                            </button>
                        </div>
                        <div className='post-content'>
                            <p>{post.content}</p>
                            {post.image && (
                                <img src={post.image} alt="post content" className='post-image'/>
                            )}
                        </div>
                        <div className='post-stats'>
                            <span>{post.likes} likes</span>
                            <span>{post.comments} comments</span>
                        </div>
                        <div className='post-actions'>
                            <button className={`post-action${post.likedByUser ? 'liked':''}`}
                            onClick={()=> handleLike(post.id)}>
                                <ThumbsUp className='action-icon'/>
                                {post.likedByUser?'Unlike':'Like'}
                            </button>
                            <button className='post-action' onClick={()=>handleComment(post.id)}>
                                <MessageSquare className='action-icon'/>
                                Comment
                            </button>
                        </div>
                        <div className='post-comments'>
                          {post.commentsList?.map(c=>(
                            <div key={c.id} className='comment'>
                              <strong>{c.authorName}</strong>:{c.message}
                            </div>
                          ))}
                        </div>
                    </article>
                ))}
            </div>
        </main>
        
        <aside className='right-sidebar'>
            <div className='search-results'>
                <h4 className='section-title'>
                    {searchTerm ? `Search Results for "${searchTerm}"`:'suggested Professionals'}
                </h4>
                <div className='professionals-list'>
                    {users.map(user => (
                        <div key = {user._id} className='Professional-card'>
                            <img src={user.profileImage || profile1}
                             alt={user.username} className="professional-avatar" />
                            <div className="professional-info">
                                <h5 className="professional-name">{user.username}</h5>
                                <p className="professional-title">{user.jobTitle}</p>
                                <p className="professional-company">{user.company}</p>
                                <p className="professional-location">{user.location}</p>
                                <span className="professional-connections">{user.connections?.length ?? 0}+ connections</span>
                            </div>
                            <button className='connect-btn'>Connect</button>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    </div>

    {showNotifications && (
        <div className="notification-overlay">
            <div className="notification-dropdown">
                <div className="notification-header">
                    <h4>Notifications</h4>
                    <div className="notifications-actions">
                        <button onClick={onMarkAllNotificationsAsRead} className="mark-all-read-btn">Mark all as read</button>
                        <button onClick={() => setShowNotifications(false)} className="close-notifications-btn"><X /></button>
                    </div>
                </div>

                <div className="notifications-list">
                    {notifications.length === 0 ? (
                        <div className="no-notifications">
                            <Bell size={48} />
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                                onClick={() => onMarkAllNotificationsAsRead()}
                            >
                                <div className="notification-icon">
                                    {notification.avatar ? (
                                        <img src={notification.avatar} alt="" className="notification-avatar" />
                                    ) : (
                                        <span className="notification-emoji">{getNotificationIcon(notification.type)}</span>
                                    )}
                                </div>
                                <div className="notification-content">
                                    <h5 className="notification-title">{notification.title}</h5>
                                    <p className="notification-message">{notification.message}</p>
                                    <span className="notification-time">{notification.timestamp}</span>
                                </div>
                                {!notification.isRead && <div className="unread-indicator"></div>}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )}
</div>
  );
}
