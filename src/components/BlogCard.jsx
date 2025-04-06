import React from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, deleteDoc } from "firebase/firestore";

const BlogCard = ({ blog, showActions = false }) => {
  const [user] = useAuthState(auth);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog post?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "blogs", blog.id));
      alert("Blog post deleted successfully!");
      window.location.reload(); // Refresh the page to reflect the deletion
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog post.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 transition hover:shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800">{blog.title}</h2>
      <p className="text-gray-500 text-sm mb-2">
        Category: <span className="font-medium capitalize">{blog.category}</span>
      </p>
      <p className="text-gray-600 text-sm line-clamp-3">{blog.content}</p>

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-400">
          Posted by: <span className="font-semibold">{blog.author.name}</span>
        </p>
        <Link
          to={`/blog/${blog.id}`}
          className="text-blue-500 hover:text-blue-700 font-medium text-sm"
        >
          Read more →
        </Link>
      </div>

      {/* Show Edit/Delete buttons only if current user is the author */}
      {showActions && user?.uid === blog.author.uid && (
        <div className="flex gap-4 mt-3">
          <Link
            to={`/edit/${blog.id}`}
            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogCard;
