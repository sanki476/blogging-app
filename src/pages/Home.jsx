import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase";
import BlogCard from "../components/BlogCard";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const LIMIT = 5;

  const fetchBlogs = async () => {
    setLoading(true);

    let blogQuery = query(
      collection(db, "blogs"),
      orderBy("createdAt", "desc"),
      ...(lastDoc ? [startAfter(lastDoc)] : []),
      limit(LIMIT)
    );

    const snapshot = await getDocs(blogQuery);
    const fetchedBlogs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // ✅ Apply filters after fetching
    let filtered = [...fetchedBlogs];
    if (searchQuery) {
      filtered = filtered.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter((blog) => blog.category === selectedCategory);
    }

    setBlogs((prev) => [...prev, ...filtered]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setHasMore(snapshot.docs.length === LIMIT);
    setLoading(false);
  };

  useEffect(() => {
    setBlogs([]);
    setLastDoc(null);
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Latest Blog Posts</h1>

      {/* 🔍 Search & Filter UI */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          placeholder="Search blogs..."
          className="border p-2 rounded flex-grow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="tech">Tech</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="travel">Travel</option>
          <option value="other">Other</option>
        </select>
        {(searchQuery || selectedCategory) && (
          <button
            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("");
              setBlogs([]);
              setLastDoc(null);
              fetchBlogs();
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* 🧾 Blog Cards */}
      <div className="grid gap-4">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>

      {/* 📦 Load More */}
      {hasMore && !searchQuery && !selectedCategory && (
        <div className="flex justify-center mt-4">
          <button
            onClick={fetchBlogs}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
