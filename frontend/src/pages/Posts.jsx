import React, { useEffect, useState } from 'react';
import './Posts.css';
import { addPostToFirebase, fetchPostsFromFirebase, updatePostLikes, updatePostDislikes } from "../firebasedb/firebaseMethods";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [viewingPost, setViewingPost] = useState(null); // State for currently viewed post
  const [newCode, setNewCode] = useState(""); 
  const [newStore, setNewStore] = useState("");

  //Fetching posts from firebase
  useEffect(() => {
    const loadPosts = async () => {
        const fetchedPosts = await fetchPostsFromFirebase();
        setPosts(fetchedPosts);
    };
    loadPosts();
}, []);


const handleAddPost = async () => {
  if (newPost.trim()) {
      const post = {
          content: newPost.trim(),
          likes: 0,
          dislikes: 0,
          hasLiked: false,
          hasDisliked: false,
          code: newCode.trim(), 
          store: newStore.trim(),
          verified: true,
          discoverer: "Anonymous",
          discoveredAt: new Date().toISOString(),
      };
      const addedPost = await addPostToFirebase(post);
      setPosts((prevPosts) => [addedPost, ...prevPosts]);
      setNewPost("");
      setNewCode("");
      setNewStore("");
  }
};


const handleLike = async (id) => {
  await updatePostLikes(id);
  setPosts((prevPosts) =>
      prevPosts.map((post) =>
          post.id === id ? { ...post, likes: post.likes + 1, hasLiked: true } : post
      )
  );
};

const handleDislike = async (id) => {
  await updatePostDislikes(id);
  setPosts((prevPosts) =>
      prevPosts.map((post) =>
          post.id === id ? { ...post, dislikes: post.dislikes + 1, hasDisliked: true } : post
      )
  );
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
            <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="Enter the code (e.g., SAVE20)"
                className="new-code-input"
            />
            <input
                type="text"
                value={newStore}
                onChange={(e) => setNewStore(e.target.value)}
                placeholder="Enter the store name (e.g., Amazon)"
                className="new-store-input"
            />
            <button onClick={handleAddPost} className="add-post-button">Post</button>
          </div>

          <ul className="posts-list">
              {posts.map((post) => (
                  <li key={post.id} className="post-item">
                      <div className="post-content">
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
                                      btn.textContent = "Copied!";
                                      setTimeout(() => {
                                          btn.textContent = "Copy";
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
