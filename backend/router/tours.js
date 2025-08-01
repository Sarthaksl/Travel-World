import express from "express";
import { 
  createTour, 
  deleteTour, 
  getAllTour, 
  getFeaturedTour, 
  getSingleTour, 
  getTourCount, 
  updateTour,
  getTourBySearch // Importing the controller function
} from "../controllers/tourController.js";
import verifyToken, { verifyAdmin } from "../utils/verifyToken.js";

const tourRoute = express.Router();

// Route for getting featured tours
tourRoute.get("/featured", getFeaturedTour);

// Route for getting a single tour by ID
tourRoute.get("/:id", getSingleTour);

// Route for searching tours (this is the new route you're adding)
tourRoute.get("/search/getTourBySearch", getTourBySearch);
tourRoute.get("/search/getFeaturedTours", getFeaturedTour);
tourRoute.get("/search/getTourCount", getTourCount); 

// Protected route for creating a new tour (only admin)
tourRoute.post("/", verifyToken, verifyAdmin, createTour);

// Protected route for updating a tour by ID (only admin)
tourRoute.put("/:id", verifyToken, verifyAdmin, updateTour);

// Protected route for deleting a tour by ID (only admin)
tourRoute.delete("/:id", verifyToken, verifyAdmin, deleteTour);

// Route for getting all tours
tourRoute.get("/", getAllTour);

// Route for getting the tour count
tourRoute.get("/count", getTourCount);

export default tourRoute;
