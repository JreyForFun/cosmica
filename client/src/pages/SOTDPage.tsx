import React, { useEffect, useState } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";

export const SOTDPage = () => {
  const [sotd, setSotd] = useState({});

  useEffect(() => {
    axios.get('/api/nasa/apod')
      .then(response => {
        setSotd(response.data);
      })
      .catch(error => {
        console.error('Error fetching SOTD:', error);
      });
  }, []);


  return (
    <div className="max-w-7xl mx-auto p-4">
      
    </div>
  )
}