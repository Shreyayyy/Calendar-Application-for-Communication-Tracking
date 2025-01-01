import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SelectionPage.css"; // Optional: Add custom styles

const SelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="selection-page">
      <h1>Welcome! Please Select an Option</h1>
      <div className="options">
        <button onClick={() => navigate("/admin")}>Admin</button>
        <button onClick={() => navigate("/user")}>User</button>
      </div>
    </div>
  );
};

export default SelectionPage;
