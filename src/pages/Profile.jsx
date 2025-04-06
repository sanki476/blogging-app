import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import BlogCard from "../components/BlogCard";
import { Link } from "react-router-dom";

const Profile = () => {
  const [user] = useAuthState(auth);
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBlogs = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "blogs"),
        where("author.uid", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      const blogsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyBlogs(blogsData);
    } catch (error) {
      console.error("Error fetching user blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, [user]);

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-lg">You need to <Link to="/login" className="text-blue-500 underline">log in</Link> to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold mb-2">👤 Your Profile</h2>
        <p className="text-gray-700">Email: <span className="font-medium">{user.email}</span></p>
        <p className="text-gray-500 text-sm">UID: {user.uid}</p>
      </div>

      <h3 className="text-xl font-semibold mb-3">📝 Your Blog Posts:</h3>

      {loading ? (
        <p>Loading your blogs...</p>
      ) : myBlogs.length === 0 ? (
        <p className="text-gray-500">You haven't posted any blogs yet.</p>
      ) : (
        <div className="grid gap-4">
          {myBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} showActions={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
