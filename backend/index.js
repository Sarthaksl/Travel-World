import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";
import crypto from "crypto"; // For signature verification
import authRoute from "./router/auth.js";
import tourRoute from "./router/tours.js";
import userRoute from "./router/users.js";
import reviewRoute from "./router/review.js";
import bookingRoute from "./router/bookings.js";
import searchRoute from "./router/Search.js";
import contactRoute from "./router/contact.js";
import blogRoute from "./router/blog.js";
import commentRoute from "./router/comment.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// MongoDB Connection
mongoose.set("strictQuery", false);

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Database Connected");
  } catch (err) {
    console.log("MongoDB Database Connection Failed");
  }
}

// Cors Options
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

// Razorpay instance for test mode
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,      // Add your Test Mode Key ID in .env
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Add your Test Mode Key Secret in .env
});

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/search", searchRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/booking", bookingRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/blogs", blogRoute);
app.use("/api/v1/comment", commentRoute);

// Payment route to create a new Razorpay order
app.post('/api/v1/payment', async (req, res) => {
  const { amount, currency = "INR" } = req.body;
  const options = {
    amount: amount * 100,  // Amount is in the smallest currency unit
    currency: currency,
    receipt: "receipt#1",  // Can be a dynamic ID in production
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

// Payment verification route
app.post('/api/v1/payment/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    res.status(200).json({ status: "success", message: "Payment verified" });
  } else {
    res.status(400).json({ status: "failure", message: "Payment verification failed" });
  }
});

app.listen(port, () => {
  connect();
  console.log("Server is listening on port", port);
});
