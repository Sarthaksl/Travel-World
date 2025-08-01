import React, { useEffect, useState } from "react";
import BlogCard from "../shared/BlogCard"; // Ensure this path is correct based on your structure

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await fetch("/api/blogs"); // Adjust the endpoint as necessary
      const data = await response.json();
      setBlogs(data);
    };

    fetchBlogs();
  }, []);

  return (
    <div>
      <h1>Blogs</h1>
      <div className="blog__list">
        {blogs.map(blog => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default BlogList;
