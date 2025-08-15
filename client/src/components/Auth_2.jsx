import React, { Component } from "react";
import { connect } from "react-redux";
import { authUser, logout } from "../store/actions";
import { Link } from "react-router-dom";
import { MdError } from "react-icons/md";
import ErrorMessage from "./ErrorMessage";
import "../assets/css/Auth_2.css";

class Auth_2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      emailId: "",
      password: "",
      confirmpassword: "",
      errors: {},
    };
  }

  // Validate individual field on each keystroke
  validateField = (name, value) => {
    const errors = { ...this.state.errors };

    if (name === "username") {
      if (!value) {
        errors.username = "Username is required";
      } else if (value.length !== 11) {
        errors.username = "Username must be exactly 11 characters";
      } else {
        delete errors.username;
      }
    }

    if (name === "emailId") {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        errors.emailId = "Email is required";
      } else if (!emailRegex.test(value)) {
        errors.emailId = "Enter a valid email address";
      } else {
        delete errors.emailId;
      }
    }

    if (name === "password") {
      const pwdRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      if (!value) {
        errors.password = "Password is required";
      } else if (!pwdRegex.test(value)) {
        errors.password =
          "Password must be 8+ chars with uppercase, lowercase, number, and special char";
      } else {
        delete errors.password;
      }
    }

    if (name === "confirmpassword") {
      if (!value) {
        errors.confirmpassword = "Confirm password is required";
      } else if (value !== this.state.password) {
        errors.confirmpassword = "Passwords do not match!";
      } else {
        delete errors.confirmpassword;
      }
    }

    this.setState({ errors });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value }, () =>
      this.validateField(name, value)
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { username, emailId, password, confirmpassword, errors } = this.state;

    if (
      !username ||
      !emailId ||
      !password ||
      !confirmpassword ||
      Object.keys(errors).length > 0
    ) {
      alert("Please fix the validation errors before submitting.");
      return;
    }

    const { authType } = this.props;
    this.props.authUser(authType || "login", { username, password, emailId });

    this.setState({
      username: "",
      emailId: "",
      password: "",
      confirmpassword: "",
      errors: {},
    });
  };

  render() {
    const { username, emailId, password, confirmpassword, errors } = this.state;

    const isFormInvalid =
      !username || !emailId || !password || !confirmpassword || Object.keys(errors).length > 0;

    return (
      <div className="section">
        <div className="container">
          <div className="user signinBx">
            <div className="imgBx">
              <img src="" alt="Apurva Software Solutions Internship Programme" />
              <p>Internship Management System</p>
            </div>
            <div className="formBx">
              <form onSubmit={this.handleSubmit} autoComplete="off">
                <div className="Errorbox">
                  <div className="my-4 text-center" style={{ zIndex: 10 }}>
                    <ErrorMessage />
                  </div>
                </div>
                <h2>Student Registration</h2>

                <div className="input-container">
                  <input
                    type="text"
                    value={username}
                    name="username"
                    placeholder="Username"
                    className="form-control"
                    autoComplete="off"
                    onChange={this.handleChange}
                  />
                  <div className="error-space">
                    {errors.username && (
                      <small className="text-danger">
                        <MdError /> {errors.username}
                      </small>
                    )}
                  </div>
                </div>

                <div className="input-container">
                  <input
                    type="email"
                    value={emailId}
                    name="emailId"
                    placeholder="Email ID"
                    className="form-control"
                    autoComplete="off"
                    onChange={this.handleChange}
                  />
                  <div className="error-space">
                    {errors.emailId && (
                      <small className="text-danger">
                        <MdError /> {errors.emailId}
                      </small>
                    )}
                  </div>
                </div>

                <div className="input-container">
                  <input
                    type="password"
                    value={password}
                    name="password"
                    placeholder="Password"
                    className="form-control"
                    autoComplete="new-password"
                    onChange={this.handleChange}
                  />
                  <div className="error-space">
                    {errors.password && (
                      <small className="text-danger">
                        <MdError /> {errors.password}
                      </small>
                    )}
                  </div>
                </div>

                <div className="input-container">
                  <input
                    type="password"
                    value={confirmpassword}
                    name="confirmpassword"
                    placeholder="Confirm Password"
                    className="form-control"
                    autoComplete="new-password"
                    onChange={this.handleChange}
                  />
                  <div className="error-space">
                    {errors.confirmpassword && (
                      <small className="text-danger">
                        <MdError /> {errors.confirmpassword}
                      </small>
                    )}
                  </div>
                </div>

                <div className="text-center mt-3">
                  <Link className="btn-custom mr-2" to="/login">
                    <b>Login</b>
                  </Link>
                  <input
                    type="submit"
                    value="Register"
                    disabled={isFormInvalid}
                    style={{
                      backgroundColor: isFormInvalid ? "#ccc" : "green",
                      color: "#fff",
                      cursor: isFormInvalid ? "not-allowed" : "pointer",
                      border: "none",
                      padding: "8px 16px",
                      marginLeft: "10px",
                    }}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(() => ({}), { authUser, logout })(Auth_2);
