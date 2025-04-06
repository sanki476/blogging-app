import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const categories = ["Tech", "Lifestyle", "Education", "Travel", "Health"];

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      const docRef = doc(db, "blogs", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Check if current user is the owner
        if (data.author.uid !== user.uid) {
          alert("You are not authorized to edit this post.");
          navigate("/");
          return;
        }

        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category || "");
        setTags((data.tags || []).join(", "));
      } else {
        alert("Blog post not found.");
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      alert("Error fetching blog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPost();
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title || !content || !category) {
      alert("Please fill all required fields.");
      return;
    }

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    try {
      const docRef = doc(db, "blogs", id);
      await updateDoc(docRef, {
        title,
        content,
        category,
        tags: tagsArray,
        updatedAt: new Date(),
      });

      alert("Blog updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Something went wrong while updating.");
    }
  };

  if (loading) return <div className="p-4 text-center">Loading post...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Blog Post</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="8"
          className="w-full p-2 border border-gray-300 rounded"
        ></textarea>

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditPost;
