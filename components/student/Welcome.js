import React from "react";

const Welcome = ({ username }) => {
  return (
    <div className="bg-indigo-500 rounded-2xl shadow-lg p-5 h-30">
      <h1 className="text-2xl font-semibold mb-3 text-white">
        Welcome, {username}!
      </h1>
    </div>
  );
};

export default Welcome;
