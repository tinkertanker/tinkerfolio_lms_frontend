import React from "react";
import { useState, useEffect } from "react";

const Welcome = ({ username }) => {
  const [currentDate, setCurrentDate] = useState(null);

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  return (
    <div className="bg-indigo-500 rounded-2xl shadow-lg p-5">
      <h1 className="text-2xl font-semibold mb-3 text-white">
        Welcome, {username}! 🏡{" "}
      </h1>
      {currentDate && <p className="text-white">Updated: {currentDate}</p>}
    </div>
  );
};

export default Welcome;

