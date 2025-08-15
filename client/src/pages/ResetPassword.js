import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetUserPassword } from "../store/actions/auth";
import "../assets/css/ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const history = useHistory(); // ✅ v5 hook
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    dispatch(resetUserPassword(token, { password: formData.password }))
      .then(() => {
        setSuccess("Password reset successfully! Redirecting...");
        setTimeout(() => history.push("/"), 3000); // ✅ history.push
      })
      .catch(() => {
        setError("Password reset failed. Please try again.");
      });
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2>Reset Your Password</h2>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label>New Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter new password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
