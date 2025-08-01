// Booking.jsx
import React, { useState, useContext } from "react";
import "./Booking.css";
import { Form, FormGroup, ListGroup, Button, ListGroupItem, Alert } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../utils/config";

const Booking = ({ tour, avgRating, totalRating, reviews }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Check if tour is undefined and set a loading state
  const [isLoading, setIsLoading] = useState(!tour);
  
  // Initialize booking state regardless of tour's state
  const [booking, setBooking] = useState({
    userId: user ? user.username : "",
    userEmail: user ? user.email : "",
    tourName: tour ? tour.title : "Unknown Tour",
    fullName: "",
    phone: "",
    bookAt: "",
    groupSize: "",
  });

  const [isBookingSuccessful, setIsBookingSuccessful] = useState(false);
  const [isBookingFailed, setIsBookingFailed] = useState(false);
  const [isLoginAlertVisible, setIsLoginAlertVisible] = useState(false);

  // Get current date
  const currentDate = new Date().toISOString().split("T")[0];

  // Handle case where tour is undefined
  if (isLoading) {
    return <p>Loading tour data...</p>; // Show loading state
  }

  // Destructure with default values to prevent errors
  const { price = 0, title = "Unknown Tour" } = tour;

  const handleChange = (e) => {
    setBooking((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handlePayment = async (totalAmount) => {
    const options = {
      key: "rzp_test_dDRfvvt96dpvdw", // Replace with your Razorpay key
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
      name: "Your Tour Company",
      description: `Booking for ${title}`,
      handler: async (response) => {
        // Handle the response after payment
        const paymentData = {
          userId: booking.userId,
          tourName: title,
          fullName: booking.fullName,
          phone: booking.phone,
          bookAt: booking.bookAt,
          groupSize: booking.groupSize,
          paymentId: response.razorpay_payment_id,
        };

        // Send payment data to your server to save the booking
        await fetch(`${BASE_URL}/booking`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(paymentData),
        });

        // After successful booking and payment, redirect or show a success message
        setIsBookingSuccessful(true);
        navigate("/payment"); // Change this line if you want to navigate elsewhere
      },
      theme: {
        color: "#3399cc", // Customize the button color
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        setIsLoginAlertVisible(true);
        return;
      }

      const groupSize = booking.groupSize || 1;
      const taxes = (0.05 * price * groupSize).toFixed(2);
      const total = (price * groupSize + parseFloat(taxes)).toFixed(2);

      // Trigger payment with the total amount
      handlePayment(total);

    } catch (error) {
      setIsBookingFailed(true);
    }
  };

  return (
    <div className="booking">
      {isBookingSuccessful && (
        <Alert color="success">Booking Successful</Alert>
      )}

      {isBookingFailed && (
        <Alert color="danger">Failed to book. Please try again.</Alert>
      )}

      {isLoginAlertVisible && (
        <Alert color="warning">Please login to proceed with the booking.</Alert>
      )}

      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>
        ₹{price} <span>/Per Person</span>
        </h3>
        <span className="tour__rating d-flex align-items-center gap-1">
          <i className="ri-star-fill"></i>
          {avgRating === 0 ? null : avgRating}
          {totalRating === 0 ? (
            <span>Not Rated</span>
          ) : (
            <span>({reviews.length || 0})</span>
          )}
        </span>
      </div>

      <div className="booking__form">
        <h5>Information</h5>
        <Form className="booking__info-form" onSubmit={handleClick}>
          <FormGroup>
            <input
              type="text"
              placeholder="Full Name"
              id="fullName"
              required
              onChange={handleChange}
              value={booking.fullName}
            />
          </FormGroup>
          <FormGroup>
            <input
              type="number"
              placeholder="Phone"
              id="phone"
              required
              onChange={handleChange}
              value={booking.phone}
            />
          </FormGroup>
          <FormGroup className="d-flex align-items-center gap-3">
            <input
              type="date"
              placeholder="Date"
              id="bookAt"
              required
              onChange={handleChange}
              value={booking.bookAt}
              min={currentDate} // Set min attribute to current date
            />
            <input
              type="number"
              placeholder="Group Size"
              id="groupSize"
              required
              onChange={handleChange}
              value={booking.groupSize}
            />
          </FormGroup>
          <Button className="btn primary__btn w-100 mt-4" type="submit">
            Book Now
          </Button>
        </Form>
      </div>

      <div className="booking__bottom">
        <ListGroup>
          <ListGroupItem className="border-0 px-0">
            <h5 className="d-flex align-items-center gap-1">
            ₹{price} <i className="ri-close-line"></i>
              {booking.groupSize || 1} Person
            </h5>
            <span>₹{(price * (booking.groupSize || 1)).toFixed(2)}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0">
            <h5>Taxes</h5>
            <span>₹{(0.05 * price * (booking.groupSize || 1)).toFixed(2)}</span>
          </ListGroupItem>

          <ListGroupItem className="border-0 px-0 total">
            <h5>Total</h5>
            <span>₹{(price * (booking.groupSize || 1) * 1.05).toFixed(2)}</span>
          </ListGroupItem>
        </ListGroup>
      </div>
    </div>
  );
};

export default Booking;
