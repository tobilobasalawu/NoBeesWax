import React, { useState } from 'react';
import './Posts.css';

function Posts() {
  const [posts, setPosts] = useState([
    { 
      id: 1, 
      content: 'Found a working SPRING30 code for NewEgg!',
      code: 'SPRING30',
      store: 'NewEgg',
      verified: true,
      likes: 24, 
      dislikes: 0, 
      hasLiked: false, 
      hasDisliked: false,
      discoverer: 'HoneyHunter',
      discoveredAt: '2024-03-15T14:30:00Z',
      discovererRank: 'Elite Hunter'
    },
    { 
      id: 2, 
      content: 'Amazon Prime members: Use PRIME20 for extra 20% off',
      code: 'PRIME20',
      store: 'Amazon',
      verified: true,
      likes: 156, 
      dislikes: 2, 
      hasLiked: false, 
      hasDisliked: false,
      discoverer: 'DealSeeker',
      discoveredAt: '2024-03-14T09:15:00Z',
      discovererRank: 'Master Hunter' 
    },
    { 
      id: 3, 
      content: 'Best Buy student discount still working!',
      code: 'STUDENT10',
      store: 'Best Buy',
      verified: true,
      likes: 89, 
      dislikes: 1, 
      hasLiked: false, 
      hasDisliked: false 
    },
    {
      id: 4,
      content: 'Target: 30% off home decor with code',
      code: 'HOME30',
      store: 'Target',
      verified: true,
      likes: 45,
      dislikes: 0,
      hasLiked: false,
      hasDisliked: false
    },
    {
      id: 5,
      content: 'Walmart clearance + extra 15% off',
      code: 'EXTRA15',
      store: 'Walmart',
      verified: true,
      likes: 167,
      dislikes: 3,
      hasLiked: false,
      hasDisliked: false
    },
    {
      id: 6,
      content: 'Nike: Free shipping on all orders',
      code: 'SHIPFREE',
      store: 'Nike',
      verified: true,
      likes: 234,
      dislikes: 5,
      hasLiked: false,
      hasDisliked: false
    },
  ]);

  const [newPost, setNewPost] = useState('');
  const [viewingPost, setViewingPost] = useState(null);

  const handleAddPost = () => {
    if (newPost.trim()) {
      setPosts([...posts, { id: Date.now(), content: newPost.trim(), likes: 0, dislikes: 0, hasLiked: false, hasDisliked: false }]);
      setNewPost('');
    }
  };

  const handleLike = (id) => {
    setPosts(posts.map(post => 
      post.id === id && !post.hasLiked
        ? { ...post, likes: post.likes + 1, hasLiked: true }
        : post
    ));
  };

  const handleDislike = (id) => {
    setPosts(posts.map(post => 
      post.id === id && !post.hasDisliked
        ? { ...post, dislikes: post.dislikes + 1, hasDisliked: true }
        : post
    ));
  };

  const handleViewPost = (post) => {
    setViewingPost(post);
  };

  const handleClosePost = () => {
    setViewingPost(null);
  };

  return (
    <div className="posts-container">
      <h1 className="posts-title">Community Verified Codes</h1>
      <p className="posts-description">Discover and share working codes with the hive! 🐝</p>

      {viewingPost ? (
        <div className="view-post-container">
          <h2 className="view-post-title">Post Details</h2>
          <p className="view-post-content">{viewingPost.content}</p>
          
          <div className="code-display">
            <code>{viewingPost.code}</code>
            <button 
              className="copy-code-btn" 
              onClick={(e) => {
                navigator.clipboard.writeText(viewingPost.code);
                const btn = e.target;
                btn.textContent = 'Copied!';
                setTimeout(() => {
                  btn.textContent = 'Copy';
                }, 2000);
              }}
            >
              Copy
            </button>
          </div>

          <div className="discoverer-info">
            <div className="discoverer-name">
              Discovered by {viewingPost.discoverer} ({viewingPost.discovererRank})
            </div>
            <div className="discovery-date">
              {new Date(viewingPost.discoveredAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          <div className="view-post-actions">
            <button
              onClick={() => handleLike(viewingPost.id)}
              className="like-button"
              disabled={viewingPost.hasLiked}
            >
              Like ({viewingPost.likes})
            </button>
            <button
              onClick={() => handleDislike(viewingPost.id)}
              className="dislike-button"
              disabled={viewingPost.hasDisliked}
            >
              Dislike ({viewingPost.dislikes})
            </button>
          </div>
          
          <button onClick={handleClosePost} className="close-post-button">
            Return to Feed
          </button>
        </div>
      ) : (
        <>
          <div className="add-post-container">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Start a post about coupon codes..."
              className="new-post-input"
            />
            <button onClick={handleAddPost} className="add-post-button">Post</button>
          </div>

          <ul className="posts-list">
            {posts.map(post => (
              <li key={post.id} className="post-item" style={{ animation: `fadeIn 0.6s ease-out ${post.id * 0.1}s both` }}>
                <div className="post-content" onClick={() => handleViewPost(post)}>
                  <div className="post-header">
                    <span className="store-tag">{post.store}</span>
                    {post.verified && <span className="verified-tag">✓ Verified</span>}
                  </div>
                  <p>{post.content}</p>
                  <div className="code-display">
                    <code>{post.code}</code>
                    <button 
                      className="copy-code-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(post.code);
                        const btn = e.target;
                        btn.textContent = 'Copied!';
                        setTimeout(() => {
                          btn.textContent = 'Copy';
                        }, 2000);
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="post-actions">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="like-button"
                    disabled={post.hasLiked}
                  >
                    Like ({post.likes})
                  </button>
                  <button
                    onClick={() => handleDislike(post.id)}
                    className="dislike-button"
                    disabled={post.hasDisliked}
                  >
                    Dislike ({post.dislikes})
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Posts;
