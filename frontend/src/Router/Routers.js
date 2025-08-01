import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Tours from '../pages/Tours';
import TourDetails from '../pages/TourDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import SearchResultList from '../pages/SearchResultList';
import ThankYou from '../pages/ThankYou';
import About from '../pages/About';
import FAQ from '../shared/FAQ';
import Contact from '../pages/Contact';
import Gallery from '../pages/Gallery';
import PageNotFound from '../pages/PageNotFound';
import Blogs from '../pages/Blogs';
import BlogDetails from '../pages/BlogDetails';
import ScrollToTop from '../utils/scrolltoTop';

const Router = () => {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/search" element={<SearchResultList />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blogs/:id" element={<BlogDetails />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes></>
  );
};

export default Router;