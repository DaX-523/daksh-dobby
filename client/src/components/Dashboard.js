// DashboardPage.js
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the selected file
    console.log("file", file);
  };
  const navigate = useNavigate();
  const name = useRef(null);
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Form submission logic here
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.current.value);
    formData.append("image", file); // Append the file

    const token = localStorage.getItem("auth");
    const data = await fetch("http://localhost:4002/upload", {
      method: "POST",

      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });
    const json = await data.json();
    console.log("Form submitted", json);
  };
  const handleLogout = () => {
    // localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <>
      <div className="signup-container">
        <h2>Dashboard</h2>
        <form onSubmit={handleSubmit}>
          <input
            ref={name}
            className="input-group"
            type="text"
            placeholder="Name"
            name="name"
            required
          />
          <input
            className="input-group"
            type="file"
            name="file"
            onChange={handleFileChange}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
    </>
  );
};

export default DashboardPage;
