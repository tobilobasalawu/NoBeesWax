import { collection, addDoc, getDocs, updateDoc, doc, increment } from "firebase/firestore";
import { db } from "./firebase";

// Add a new post
export const addPostToFirebase = async (post) => {
    try {
        const docRef = await addDoc(collection(db, "posts"), post);
        return { id: docRef.id, ...post };
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
};

// Fetch all posts
export const fetchPostsFromFirebase = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching documents: ", error);
        throw error;
    }
};

// Update likes
export const updatePostLikes = async (postId) => {
    try {
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, { likes: increment(1) });
    } catch (error) {
        console.error("Error updating likes: ", error);
        throw error;
    }
};

// Update dislikes
export const updatePostDislikes = async (postId) => {
    try {
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, { dislikes: increment(1) });
    } catch (error) {
        console.error("Error updating dislikes: ", error);
        throw error;
    }
};

const updateLikeStatus = async (postId, action) => {
    const postRef = doc(db, "posts", postId);
    try {
        if (action === "like") {
            await updateDoc(postRef, { 
                likes: increment(1), 
                hasLiked: true, 
                hasDisliked: false 
            });
        } else if (action === "dislike") {
            await updateDoc(postRef, { 
                dislikes: increment(1), 
                hasLiked: false, 
                hasDisliked: true 
            });
        }
    } catch (error) {
        console.error("Error updating like/dislike: ", error);
    }
};
