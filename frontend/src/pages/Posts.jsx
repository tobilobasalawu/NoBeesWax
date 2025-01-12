import React, { useState } from 'react';
import './Posts.css';

function Posts() {
  const [posts, setPosts] = useState([
    { id: 1, content: 'Coupon trends in 2025', likes: 0, dislikes: 0, hasLiked: false, hasDisliked: false },
    { id: 2, content: 'How to save more with smart hunting', likes: 0, dislikes: 0, hasLiked: false, hasDisliked: false },
    { id: 3, content: 'Top 10 coupon sites this year', likes: 0, dislikes: 0, hasLiked: false, hasDisliked: false },
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
      <h1 className="posts-title">Coupon Feeds</h1>
      <p className="posts-description">Discover and share the latest coupon codes!</p>

      {viewingPost ? (
        <div className="view-post-container">
          <h2 className="view-post-title">Post Details</h2>
          <p className="view-post-content">{viewingPost.content}</p>
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
          <button onClick={handleClosePost} className="close-post-button">Close</button>
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
              <li key={post.id} className="post-item">
                <span className="post-content" onClick={() => handleViewPost(post)}>
                  {post.content}
                </span>
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
