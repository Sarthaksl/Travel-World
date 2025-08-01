import React, { useEffect, useState } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/tours.css";
import Newsletter from "../shared/Newsletter";
import { Container, Row, Col } from "reactstrap";
import BlogCard from "../shared/BlogCard";
import axios from "axios";
import { BASE_URL } from "../utils/config";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch blogs data from the API
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/blogs`);
        console.log(response.data); // Log the fetched data for debugging

        if (Array.isArray(response.data)) {
          setBlogs(response.data);
        } else {
          console.error("Fetched data is not an array:", response.data);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err); // Log the error for debugging
        setError("Error loading blog details. Check your network.");
      } finally {
        setLoading(false); // Ensure loading is set to false in both success and error cases
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader" />
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  if (error) {
    return <div className="error__msg">{error}</div>;
  }

  return (
    <div>
      <CommonSection title={"All Blogs"} />
      <section className="mt-4">
        <Container>
          <Row>
            {blogs.map((blog) => (
              <Col lg="4" md="6" sm="6" className="mb-4" key={blog._id}>
                <BlogCard blog={blog} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      <Newsletter />
    </div>
  );
};

export default Blogs;
