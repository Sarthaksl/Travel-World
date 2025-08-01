import { Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout/Layout";
import PaymentComponent from "./components/Payment/Payment"; 
import BookingComponent from "./components/Booking/Booking"; 
import ThankYou from "./pages/ThankYou.jsx"; // Import ThankYou component
import BlogList from "./pages/BlogList"; // Import your blog list component
import BlogDetail from "./pages/BlogDetails"; // Import the blog detail component

function App() {
  return (
    <div className="App">
      <Layout />
      <Routes>
        <Route path="/" element={<BookingComponent />} /> 
        <Route path="/payment" element={<PaymentComponent />} /> 
        <Route path="/thank-you" element={<ThankYou />} /> {/* Thank You Page */}
        
        {/* Blog Routes */}
        <Route path="/blogs" element={<BlogList />} /> {/* Route for the blog list */}
        <Route path="/blogs/:id" element={<BlogDetail />} /> {/* Route for individual blog details */}
      </Routes>
    </div>
  );
}

export default App;
