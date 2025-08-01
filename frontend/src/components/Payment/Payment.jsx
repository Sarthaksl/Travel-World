import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const PaymentComponent = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handlePayment = async () => {
    try {
      const { data } = await axios.post('http://localhost:4000/api/v1/payment', { amount: 500 }); 

      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Your Project Name",
        description: "Payment for XYZ",
        order_id: data.id,
        handler: async function (response) {
          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          const verifyPayment = await axios.post('http://localhost:4000/api/v1/payment/verify', paymentData);

          if (verifyPayment.data.status === "success") {
            // Redirect to Thank You page on success
            navigate('/thank-you'); // Update this line
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error: ", error);
    }
  };

  return (
    <div>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default PaymentComponent;
