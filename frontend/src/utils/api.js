import React, { useEffect, useState } from 'react';
import { getTours, setAuthToken } from './api';

const ToursComponent = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthToken(token); // Set the token for authenticated requests

    getTours()
      .then((response) => {
        setTours(response.data); // Set tours data in state
      })
      .catch((error) => {
        console.error('Error fetching tours', error);
      });
  }, []);

  return (
    <div>
      <h1>Tours</h1>
      {tours.length > 0 ? (
        <ul>
          {tours.map((tour) => (
            <li key={tour._id}>{tour.title}</li>
          ))}
        </ul>
      ) : (
        <p>No tours available</p>
      )}
    </div>
  );
};

export default ToursComponent;
