import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";


const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      const docRef = doc(db, "blogs", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBlog({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such blog!");
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-4">
      {blog.imageUrl && (
        <img
          src={blog.imageUrl}
          alt="Blog"
          className="w-full rounded mb-4"
        />
      )}
      <button
        className="mb-4 text-blue-600 underline"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-4">{blog.category}</p>
      <p className="text-lg mb-4 whitespace-pre-line">{blog.content}</p>

      <div className="flex flex-wrap gap-2">
        {blog.tags?.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-200 px-2 py-1 rounded text-xs"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-6">
        {/* Placeholder for future Edit/Delete buttons */}
      </div>
    </div>
  );
};

export default BlogDetail;
